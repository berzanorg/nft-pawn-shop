import { Program, Provider, workspace, getProvider, BN } from "@coral-xyz/anchor"
import { PublicKey, Transaction, Keypair, Signer, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, createMintToInstruction, MintLayout } from "@solana/spl-token"
import { NftPawnShop } from "../target/types/nft_pawn_shop"
import { assert } from "chai"

const get3Sol = async (provider: Provider, wallet: PublicKey) => {
    const tx = await provider.connection.requestAirdrop(
        wallet,
        LAMPORTS_PER_SOL * 3
    );

    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: tx
    })
}

const getOrderPda = async (lender: PublicKey, tokenMint: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("order"), lender.toBuffer(), tokenMint.toBuffer()],
        programId,
    )[0]
}

const getPawnedNftPda = async (pawnBroker: PublicKey, tokenMint: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from("pawned_nft"), pawnBroker.toBuffer(), tokenMint.toBuffer()],
        programId,
    )[0]
}

const mintNFT = async (
    provider: Provider,
    payer: Keypair,
    mintAuthority: Keypair,
    freezeAuthority: Keypair
) => {
    // random mint key for testing purpose
    const tokenMintKeypair = Keypair.generate();

    const lamportsForMint =
        await provider.connection.getMinimumBalanceForRentExemption(
            MintLayout.span
        )

    const createMintAccountInstruction = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: MintLayout.span,
        fromPubkey: payer.publicKey,
        newAccountPubkey: tokenMintKeypair.publicKey,
        lamports: lamportsForMint,
    })

    const mintInstruction = createInitializeMintInstruction(
        tokenMintKeypair.publicKey,
        0,
        mintAuthority.publicKey,
        freezeAuthority.publicKey
    )

    const payerAta = await getAssociatedTokenAddress(
        tokenMintKeypair.publicKey,
        payer.publicKey,
    )

    const stakerAtaInstruction = createAssociatedTokenAccountInstruction(
        payer.publicKey,
        payerAta,
        payer.publicKey,
        tokenMintKeypair.publicKey
    )

    const mintToInstruction = createMintToInstruction(
        tokenMintKeypair.publicKey,
        payerAta,
        payer.publicKey,
        1,
        []
    )

    const txWithSigners: {
        tx: Transaction
        signers?: Signer[]
    }[] = [];

    const transaction1 = new Transaction();
    transaction1.add(createMintAccountInstruction);
    transaction1.add(mintInstruction);
    transaction1.add(stakerAtaInstruction);
    transaction1.add(mintToInstruction);

    txWithSigners.push({
        tx: transaction1,
        signers: [payer, tokenMintKeypair],
    })

    await provider.sendAll!(txWithSigners)

    return {
        payerAta: payerAta,
        tokenMint: tokenMintKeypair.publicKey,
    }
}

describe("nft-pawn-shop", () => {
    const provider = getProvider()
    const program = workspace.NftPawnShop as Program<NftPawnShop>


    it('can place order', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(4 * 60 * 60)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc();

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')
    })

    it('can execute order', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(4 * 60 * 60)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')
    })


    it('can pay debt', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(4 * 60 * 60)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')

        await program.methods
            .payDebt()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                pawnBroker: pawnBroker.publicKey,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: lender.publicKey,
                lenderNftAccount: lenderAta,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([lender])
            .rpc()
    })

    it('cannot pay debt if deadline is done', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(-1)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')

        try {
            await program.methods
                .payDebt()
                .accounts({
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    mint: tokenMint,
                    pawnBroker: pawnBroker.publicKey,
                    pawnedNft: pawnedNftPda,
                    pawnedNftPdaNftAccount: pawnedNftPdaAta,
                    signer: lender.publicKey,
                    lenderNftAccount: lenderAta,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers([lender])
                .rpc()
        } catch ({ error }) {
            assert.equal(error.errorCode.code, 'DebtDeadlineIsDone')
        }
    })

    it('can seize nft', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(-1)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        const pawnBrokerAta = await getAssociatedTokenAddress(tokenMint, pawnBroker.publicKey)
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')

        await program.methods
            .seizeNft()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                pawnBrokerNftAccount: pawnBrokerAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID
            })
            .signers([pawnBroker])
            .rpc()
    })

    it('cannot seize nft if deadline is not done', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(4 * 60 * 60)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        const pawnBrokerAta = await getAssociatedTokenAddress(tokenMint, pawnBroker.publicKey)
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')

        try {
            await program.methods
                .seizeNft()
                .accounts({
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    lender: lender.publicKey,
                    mint: tokenMint,
                    pawnBrokerNftAccount: pawnBrokerAta,
                    pawnedNft: pawnedNftPda,
                    pawnedNftPdaNftAccount: pawnedNftPdaAta,
                    signer: pawnBroker.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID
                })
                .signers([pawnBroker])
                .rpc()
        } catch ({ error }) {
            assert.equal(error.errorCode.code, 'DebtDeadlineIsNotDone')
        }
    })

    it('cannot seize nft if pawn broker is not right', async () => {
        const lender = Keypair.generate()
        await get3Sol(provider, lender.publicKey)

        const { payerAta: lenderAta, tokenMint } = await mintNFT(provider, lender, lender, lender)

        const duration = new BN(-1)
        const lendAmount = new BN(0.1 * LAMPORTS_PER_SOL)
        const debtAmount = new BN(0.2 * LAMPORTS_PER_SOL)

        const orderPda = await getOrderPda(lender.publicKey, tokenMint, program.programId)
        const orderPdaAta = await getAssociatedTokenAddress(tokenMint, orderPda, true);

        await program.methods
            .placeOrder(duration, lendAmount, debtAmount)
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                signer: lender.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                lenderNftAccount: lenderAta,
            })
            .signers([lender])
            .rpc()

        const order = await program.account.order.fetch(orderPda)

        assert(order.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(order.duration.eq(duration), 'duration is not right')
        assert(order.lendAmount.eq(lendAmount), 'lend amount is not right')
        assert(order.lender.equals(lender.publicKey), 'lender is not right')
        assert(order.mint.equals(tokenMint), 'mint address is not right')


        const pawnBroker = Keypair.generate()
        const pawnBrokerAta = await getAssociatedTokenAddress(tokenMint, pawnBroker.publicKey)
        await get3Sol(provider, pawnBroker.publicKey)

        const pawnedNftPda = await getPawnedNftPda(pawnBroker.publicKey, tokenMint, program.programId)
        const pawnedNftPdaAta = await getAssociatedTokenAddress(tokenMint, pawnedNftPda, true);

        await program.methods
            .executeOrder()
            .accounts({
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                lender: lender.publicKey,
                mint: tokenMint,
                order: orderPda,
                orderPdaNftAccount: orderPdaAta,
                pawnedNft: pawnedNftPda,
                pawnedNftPdaNftAccount: pawnedNftPdaAta,
                signer: pawnBroker.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([pawnBroker])
            .rpc()

        const pawnedNft = await program.account.pawnedNft.fetch(pawnedNftPda)

        assert(pawnedNft.debtAmount.eq(debtAmount), 'debt amount is not right')
        assert(pawnedNft.lender.equals(lender.publicKey), 'lender is not right')
        assert(pawnedNft.mint.equals(tokenMint), 'mint address is not right')
        assert(pawnedNft.pawnBroker.equals(pawnBroker.publicKey), 'pawn broker is not right')

        const frauder = Keypair.generate()
        const frauderAta = await getAssociatedTokenAddress(tokenMint, frauder.publicKey)
        await get3Sol(provider, frauder.publicKey)

        try {
            await program.methods
                .seizeNft()
                .accounts({
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    lender: lender.publicKey,
                    mint: tokenMint,
                    pawnBrokerNftAccount: frauderAta,
                    pawnedNft: pawnedNftPda,
                    pawnedNftPdaNftAccount: pawnedNftPdaAta,
                    signer: frauder.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID
                })
                .signers([frauder])
                .rpc()
        } catch ({ error }) {
            assert.equal(error.errorCode.code, 'ConstraintSeeds')
        }
    })
})


