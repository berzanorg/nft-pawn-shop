import { NftPawnShop } from "@/lib/idl";
import { AnchorProvider, BN, Program, ProgramAccount, web3 } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import idl from '@/lib/idl.json'

type DappContext =
    | {
        isLoaded: false
        orders?: Array<Order>
        userPda?: PublicKey | null
        userDebts?: Array<Debt>
        userLends?: Array<Lend>
        userOrders?: Array<Order>
        demoNFTsCount?: number
        demoTokensBalance?: number
        getDemoAssets?: () => Promise<void>
        placeOrder?: (durationAsSeconds: number, borrowAmount: number, debtAmount: number) => Promise<void>
        cancelOrder?: (orderIndex: number) => Promise<void>
        executeOrder?: (orderIndex: number, borrowerPda: PublicKey) => Promise<void>
        payDebt?: (debtIndex: number, lenderPda: PublicKey) => Promise<void>
        seize?: (debtIndex: number, borrowerPda: PublicKey) => Promise<void>
    }
    | {
        isLoaded: true
        orders: Array<Order>
        userPda: PublicKey | null
        userDebts: Array<Debt>
        userLends: Array<Lend>
        userOrders: Array<Order>
        demoNFTsCount: number
        demoTokensBalance: number
        getDemoAssets: () => Promise<void>
        placeOrder: (durationAsSeconds: number, borrowAmount: number, debtAmount: number) => Promise<void>
        cancelOrder: (orderIndex: number) => Promise<void>
        executeOrder: (orderIndex: number, borrowerPda: PublicKey) => Promise<void>
        payDebt: (debtIndex: number, lenderPda: PublicKey) => Promise<void>
        seize: (debtIndex: number, borrowerPda: PublicKey) => Promise<void>
    }

export interface Order {
    borrowAmount: number
    debtAmount: number
    duration: BN
    account: PublicKey
    index: number
}

export interface Debt {
    amount: number
    lenderPda: PublicKey
    deadline: BN
    account: PublicKey
    index: number
}

export interface Lend {
    amount: number
    borrowerPda: PublicKey
    deadline: BN
    index: number
}

type ProgramData = ReturnType<Program<NftPawnShop>['account']['pawnShopUser']['all']> extends Promise<infer A> ? A : never

const Context = createContext<DappContext>({
    isLoaded: false,
})

export const useDapp = () => useContext(Context)

export const DappProvider = ({ children }: { children: ReactNode }) => {
    const [programData, setProgramData] = useState<ProgramData | null>(null)

    const { connection } = useConnection()

    const { publicKey, signAllTransactions, signTransaction } = useWallet()

    const fetchProgramData = useCallback(async () => {
        const provider = new AnchorProvider(connection, {} as any, AnchorProvider.defaultOptions())
        const programToFetch = new Program(idl as unknown as NftPawnShop, idl.metadata.address, provider)
        setProgramData(await programToFetch.account.pawnShopUser.all())
    }, [connection])

    useEffect(() => {
        fetchProgramData()
    }, [fetchProgramData])

    const pda = useMemo(() => {
        if (!publicKey) return null

        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("pawn_shop_user"), publicKey.toBuffer()],
            new PublicKey(idl.metadata.address)
        )
        console.log(pda)

        return pda
    }, [publicKey])

    const program = useMemo(() => {
        if (!publicKey || !signAllTransactions || !signTransaction) return null

        const provider = new AnchorProvider(connection, { publicKey, signAllTransactions, signTransaction }, AnchorProvider.defaultOptions())

        return new Program(idl as unknown as NftPawnShop, idl.metadata.address, provider)
    }, [publicKey, signAllTransactions, signTransaction, connection])


    const isLoaded: boolean = useMemo(() => Boolean(programData), [programData])

    const orders: Array<Order> = useMemo(
        () => programData?.map(user => (
            user.account.orders.map((order, index) => (
                order.some ? {
                    borrowAmount: order.some.borrowAmount,
                    debtAmount: order.some.debtAmount,
                    duration: order.some.duration,
                    account: user.publicKey,
                    index,
                } satisfies Order : null
                /** we can use `as Array<Order>` because we filter `orders` so they're not `null` */
            )).filter(order => order !== null) as Array<Order>
        )).flat(1) ?? [],
        [programData]
    )

    const userDebts: Array<Debt> = useMemo(
        () => pda ? programData
            ?.find(user => user.publicKey.equals(pda))
            ?.account.debts.map((debt, index) => debt.some && pda ? {
                amount: debt.some.amount,
                lenderPda: debt.some.lenderPda,
                deadline: debt.some.deadline,
                account: pda,
                index,
            } satisfies Debt : null)
            /** we can use `as Array<Debt>` because we filter `debts` so they're not `null` */
            ?.filter(debt => debt !== null) as Array<Debt> : [] ?? [],
        [programData, pda]
    )

    const userLends: Array<Lend> = useMemo(
        () => pda ? programData?.map(user => (
            user.account.debts.map((debt, index) => (
                debt.some?.lenderPda.equals(pda) ? {
                    amount: debt.some.amount,
                    borrowerPda: user.publicKey,
                    deadline: debt.some.deadline,
                    index,
                } satisfies Lend : null
                /** we can use `as Array<Lend>` because we filter `lends` so they're not `null` */
            )).filter(lend => lend !== null) as Array<Lend>
        )).flat(1) ?? [] : [],
        [programData, pda]
    )

    const userOrders: Array<Order> = useMemo(
        () => pda ? programData
            ?.find(user => user.publicKey.equals(pda))
            ?.account.orders.map((order, index) => order.some && pda ? {
                borrowAmount: order.some.borrowAmount,
                debtAmount: order.some.debtAmount,
                duration: order.some.duration,
                account: pda,
                index,
            } satisfies Order : null)
            /** we can use `as Array<Order>` because we filter `debts` so they're not `null` */
            ?.filter(order => order !== null) as Array<Order> : [] ?? [],
        [programData, pda]
    )


    const demoNFTsCount: number = useMemo(
        () => (pda && programData?.find(user => user.publicKey.equals(pda))?.account.demoNfts) ?? 0,
        [programData, pda]
    )


    const demoTokensBalance: number = useMemo(
        () => (pda && programData?.find(user => user.publicKey.equals(pda))?.account.demoTokens) ?? 0,
        [programData, pda]
    )



    const getDemoAssets = useCallback(async () => {
        if (!pda || !program) return

        await program.methods.getDemoAssets()
            .accounts({ pawnShopUser: pda })
            .rpc()
    }, [program, pda])


    const placeOrder = useCallback(async (durationAsSeconds: number, borrowAmount: number, debtAmount: number) => {
        if (!pda || !program) return


        await program.methods.placeOrder(new BN(durationAsSeconds), borrowAmount, debtAmount)
            .accounts({ borrower: pda })
            .rpc()

        setTimeout(fetchProgramData, 1000);
    }, [program, pda, fetchProgramData])

    const cancelOrder = useCallback(async (orderIndex: number) => {
        if (!pda || !program) return

        await program.methods.cancelOrder(orderIndex)
            .accounts({ borrower: pda })
            .rpc()

        setTimeout(fetchProgramData, 1000);
    }, [program, pda, fetchProgramData])


    const executeOrder = useCallback(async (orderIndex: number, borrowerPda: PublicKey) => {
        if (!pda || !program) return

        await program.methods.executeOrder(orderIndex)
            .accounts({ borrower: borrowerPda, lender: pda })
            .rpc()

        setTimeout(fetchProgramData, 1000);
    }, [program, pda, fetchProgramData])


    const payDebt = useCallback(async (debtIndex: number, lenderPda: PublicKey) => {
        if (!pda || !program) return

        await program.methods.payDebt(debtIndex)
            .accounts({ borrower: pda, lender: lenderPda })
            .rpc()

        setTimeout(fetchProgramData, 1000);
    }, [program, pda, fetchProgramData])

    const seize = useCallback(async (debtIndex: number, borrowerPda: PublicKey) => {
        if (!pda || !program) return

        await program.methods.seize(debtIndex)
            .accounts({ borrower: borrowerPda, lender: pda })
            .rpc()

        setTimeout(fetchProgramData, 1000);
    }, [program, pda, fetchProgramData])

    return (
        <Context.Provider value={{
            isLoaded,
            orders,
            userPda: pda,
            userDebts,
            userLends,
            userOrders,
            demoNFTsCount,
            demoTokensBalance,
            getDemoAssets,
            placeOrder,
            cancelOrder,
            executeOrder,
            payDebt,
            seize,
        }}>
            {children}
        </Context.Provider>
    )
}









