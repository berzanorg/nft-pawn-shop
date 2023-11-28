import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IDL, type NftPawnShop } from '@/lib/idl'
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import { useNFTs } from "./NFTsProvider";


const PROGRAM_ID: PublicKey = new PublicKey('CaCpQaHiHgymut7cP9Jj7UkJXZh25fTdZftLeycWuGPV')

const getOrderPda = async (customer: PublicKey, mint: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("order"), customer.toBuffer(), mint.toBuffer()],
        PROGRAM_ID,
    )[0]
}

const getPdaAta = (mint: PublicKey, pda: PublicKey) => getAssociatedTokenAddress(mint, pda, true)

const getAta = (mint: PublicKey, address: PublicKey) => getAssociatedTokenAddress(mint, address)

export type Order =
    Awaited<ReturnType<Program<NftPawnShop>['account']['order']['all']>>[0]['account']
    &
    { pda: PublicKey, image: string, name: string }


interface PawnShop {
    orders: Array<Order>
    userOrders: Array<Order>
    userPawnedNFTs: Array<Order>
    userLends: Array<Order>
    placeOrder(params: {mint: PublicKey, durationInHours: number, borrowAmountInSOL: number, debtAmountInSOL: number}): Promise<void>
    executeOrder(params: { mint: PublicKey, customer: PublicKey, orderPda: PublicKey }): Promise<void>
    payDebt(params: {mint: PublicKey, pawnbroker: PublicKey}): Promise<void>
    seizeNFT(params: {mint: PublicKey, customer: PublicKey}): Promise<void>
    isLoaded: boolean
}


const Context = createContext<PawnShop>({} as PawnShop)

export const usePawnShop = () => useContext(Context)

export const PawnShopProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [allOrders, setAllOrders] = useState<Array<Order>>([])


    const { connection } = useConnection()
    const { publicKey, signAllTransactions, signTransaction } = useWallet()
    
    const {fetchNFTs} = useNFTs()


    const program = useMemo(() => {
        if (!publicKey || !signAllTransactions || !signTransaction) {
            const provider = new AnchorProvider(connection, {} as Wallet, AnchorProvider.defaultOptions())
            return new Program(IDL, PROGRAM_ID, provider)
        } else {
            const provider = new AnchorProvider(connection, { publicKey, signAllTransactions, signTransaction }, AnchorProvider.defaultOptions())
            return new Program(IDL, PROGRAM_ID, provider)
        }
    }, [publicKey, signAllTransactions, signTransaction, connection])


    const orders = useMemo(() => {
        if (!publicKey) return []
        return allOrders.filter(order => order.deadline === null)
    }, [allOrders, publicKey])

    const userOrders = useMemo(() => {
        if (!publicKey) return []
        return allOrders.filter(order => order.customer.equals(publicKey) && order.deadline === null)
    }, [allOrders, publicKey])

    const userLends = useMemo(() => {
        if (!publicKey) return []
        return allOrders.filter(order => order.pawnBroker?.equals(publicKey) && order.deadline !== null)
    }, [allOrders, publicKey])

    const userPawnedNFTs = useMemo(() => {
        if (!publicKey) return []
        return allOrders.filter(order => order.customer.equals(publicKey) && order.deadline !== null)
    }, [allOrders, publicKey])



    
    const fetchData = useCallback(async () => {
        setIsLoaded(false);

        const metaplex = new Metaplex(connection);

        const allOrders = await program.account.order.all()
        console.log(allOrders)

        const promises = allOrders.map(order => async () => {
            const { name, uri } = await metaplex.nfts().findByMint({ mintAddress: order.account.mint })
            const { image } = await (await fetch(uri)).json() as { image: string }
            return { ...order.account, pda: order.publicKey, image, name } satisfies Order
        })

        setAllOrders(await Promise.all(promises.map(promise => promise())))

        setIsLoaded(true)
    },[program, publicKey, connection])


    const placeOrder: PawnShop['placeOrder'] = useCallback(async ({borrowAmountInSOL, debtAmountInSOL, durationInHours, mint}) => {
        if (!publicKey) return

        const orderPda = await getOrderPda(publicKey, mint)
        const orderPdaAta = await getPdaAta(mint, orderPda)
        const signerAta = await getAta(mint, publicKey)

        const duration = new BN(durationInHours * 60 * 60)
        const borrowAmount = new BN(borrowAmountInSOL * LAMPORTS_PER_SOL)
        const debtAmount = new BN(debtAmountInSOL * LAMPORTS_PER_SOL)

        console.log(borrowAmount)
        console.log(debtAmount)
        console.log(borrowAmountInSOL)
        console.log(debtAmountInSOL)

        await program.methods
            .placeOrder(
                duration,
                borrowAmount,
                debtAmount
            )
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                customerNftAccount: signerAta,
            })
            .rpc()
            
            setTimeout(() => {
                fetchData()
                fetchNFTs()
            }, 100)
            
    }, [program, publicKey, fetchData])




    const executeOrder: PawnShop['executeOrder'] = useCallback(async ({customer, mint, orderPda}) => {
        if (!publicKey) return

        const orderPdaAta = await getPdaAta(mint, orderPda)


        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                customer,
                mint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()
            
            setTimeout(() => {
                fetchData()
            }, 100)
    }, [program, publicKey, fetchData])




    const payDebt: PawnShop['payDebt'] = useCallback(async ({mint, pawnbroker}) => {
        if (!publicKey) return

        const orderPda = await getOrderPda(publicKey, mint)
        const orderPdaAta = await getPdaAta(mint, orderPda)
        const signerAta = await getAta(mint, publicKey)

        await program.methods
            .payDebt()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint,
                pawnBroker: pawnbroker,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: publicKey,
                customerNftAccount: signerAta,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()

            setTimeout(() => {
                fetchData()
                fetchNFTs()
            }, 100)
    }, [program, publicKey, fetchData])




    const seizeNFT: PawnShop['seizeNFT'] = useCallback(async ({mint, customer}) => {
        if (!publicKey) return

        const orderPda = await getOrderPda(customer, mint)
        const orderPdaAta = await getPdaAta(mint, orderPda)
        const signerAta = await getAta(mint, publicKey)

        await program.methods
            .seizeNft()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                customer: customer,
                mint,
                pawnBrokerNftAccount: signerAta,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc()

            setTimeout(() => {
                fetchData()
                fetchNFTs()
            }, 100)
    }, [program, publicKey, fetchData])




    useEffect(() => {
        fetchData()
    }, [fetchData])




    return (
        <Context.Provider value={{
            orders,
            userPawnedNFTs,
            userOrders,
            userLends,
            placeOrder,
            executeOrder,
            payDebt,
            seizeNFT,
            isLoaded,
        }}>
            {children}
        </Context.Provider>
    )
}