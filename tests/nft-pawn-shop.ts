import { Program, Provider, workspace, getProvider, BN } from "@coral-xyz/anchor"
import { PublicKey, Transaction, Keypair, Signer, Connection, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, AccountLayout, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createInitializeMintInstruction, createMintToInstruction, MintLayout } from "@solana/spl-token"
import { NftPawnShop } from "../target/types/nft_pawn_shop"
import NftPawnShopIdl from "../target/idl/nft_pawn_shop.json"
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
        );

    const createMintAccountInstruction = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: MintLayout.span,
        fromPubkey: payer.publicKey,
        newAccountPubkey: tokenMintKeypair.publicKey,
        lamports: lamportsForMint,
    });

    const mintInstruction = createInitializeMintInstruction(
        tokenMintKeypair.publicKey,
        0,
        mintAuthority.publicKey,
        freezeAuthority.publicKey
    );

    const payerAta = await getAssociatedTokenAddress(
        tokenMintKeypair.publicKey,
        payer.publicKey,
    );

    const stakerAtaInstruction = createAssociatedTokenAccountInstruction(
        payer.publicKey,
        payerAta,
        payer.publicKey,
        tokenMintKeypair.publicKey
    );

    const mintToInstruction = createMintToInstruction(
        tokenMintKeypair.publicKey,
        payerAta,
        payer.publicKey,
        1,
        []
    );

    const txWithSigners: {
        tx: Transaction;
        signers?: Signer[];
    }[] = [];

    const transaction1 = new Transaction();
    transaction1.add(createMintAccountInstruction);
    transaction1.add(mintInstruction);
    transaction1.add(stakerAtaInstruction);
    transaction1.add(mintToInstruction);

    txWithSigners.push({
        tx: transaction1,
        signers: [payer, tokenMintKeypair], // first has to be payer because this account is used for deduction payment in any transaction
    });

    await provider.sendAll!(txWithSigners);

    return {
        payerAta: payerAta,
        tokenMint: tokenMintKeypair.publicKey,
    };
};

const getRawTokenAccount = async (provider: Provider, address: PublicKey) => {
    const account = await provider.connection.getAccountInfo(address)
    if (account == null) {
        return account
    }
    return AccountLayout.decode(account.data)
}

describe("nft-pawn-shop", () => {
    const provider = getProvider()
    const connection = provider.connection
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




    // it("All tests are passed", async () => {
    //     // create a user
    //     const [user1, user2, user3] = await Promise.all([
    //         createUser(),
    //         createUser(),
    //         createUser(),
    //     ])

    //     // request demo assets
    //     await program.methods.getDemoAssets()
    //         .accounts({
    //             pawnShopUser: user1.pda,
    //             signer: user1.keypair.publicKey
    //         }).signers([user1.keypair])
    //         .rpc()

    //     const { demoNfts, demoTokens } = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert.deepEqual(demoNfts, 1, 'Demo NFTs count is not equal to 1')
    //     assert.deepEqual(demoTokens, 100, 'Demo tokens count is not equal to 100')

    //     await program.methods.getDemoAssets()
    //         .accounts({
    //             pawnShopUser: user2.pda,
    //             signer: user2.keypair.publicKey
    //         }).signers([user2.keypair])
    //         .rpc()

    //     await program.methods.getDemoAssets()
    //         .accounts({
    //             pawnShopUser: user3.pda,
    //             signer: user3.keypair.publicKey
    //         }).signers([user3.keypair])
    //         .rpc()



    //     const duration = new anchor.BN(1000 * 60 * 60) // 1hour
    //     const borrowAmount = 10
    //     const debtAmount = 11

    //     await program.methods.placeOrder(duration, borrowAmount, debtAmount)
    //         .accounts({
    //             borrower: user1.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()

    //     let res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert(res.orders[0].some.duration.eq(duration), 'Duration is not equal to 1 hour')
    //     assert.deepEqual(res.orders[0].some.borrowAmount, borrowAmount, 'Borrow amount is not equal to 10')
    //     assert.deepEqual(res.orders[0].some.debtAmount, debtAmount, 'Debt amount is not equal to 11')






    //     await program.methods.cancelOrder(0)
    //         .accounts({
    //             borrower: user1.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()

    //     res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert(res.orders[0].none, 'Order is not cancelled')




    //     await program.methods.placeOrder(duration, borrowAmount, debtAmount)
    //         .accounts({
    //             borrower: user1.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()
    //     res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert.deepEqual(res.demoNfts, 0, 'NFT is not locked')


    //     try {
    //         await program.methods.cancelOrder(1)
    //             .accounts({
    //                 borrower: user1.pda,
    //                 signer: user3.keypair.publicKey
    //             })
    //             .signers([user3.keypair])
    //             .rpc()
    //     } catch (error) {
    //         assert.deepEqual(
    //             error.error.errorMessage,
    //             'You do not have access to complete this operation.'
    //         )
    //     }


    //     await program.methods.executeOrder(1)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user2.keypair.publicKey
    //         })
    //         .signers([user2.keypair])
    //         .rpc()
    //     res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert(res.debts[0].some, 'Order is not executed')
    //     assert.deepEqual(res.demoTokens, 110, 'Demo tokens amount is not equal to 110')
    //     res = await program.account.pawnShopUser.fetch(user2.pda)
    //     assert.deepEqual(res.demoTokens, 90, 'Demo tokens amount is not equal to 90')


    //     await program.methods.payDebt(0)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()
    //     res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert(res.debts[0].none, 'Debt is not paid')
    //     assert.deepEqual(res.demoTokens, 99, 'Demo tokens amount is not equal to 99')
    //     res = await program.account.pawnShopUser.fetch(user2.pda)
    //     assert.deepEqual(res.demoTokens, 101, 'Demo tokens amount is not equal to 101')



    //     await program.methods.placeOrder(duration/*1 hour*/, borrowAmount, debtAmount)
    //         .accounts({
    //             borrower: user1.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()

    //     await program.methods.executeOrder(2)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user2.keypair.publicKey
    //         })
    //         .signers([user2.keypair])
    //         .rpc()

    //     // debt payment deadline is not over so lender cannot seize the nft
    //     try {
    //         await program.methods.seize(1)
    //             .accounts({
    //                 borrower: user1.pda,
    //                 lender: user2.pda,
    //                 signer: user2.keypair.publicKey
    //             })
    //             .signers([user2.keypair])
    //             .rpc()
    //     } catch (error) {
    //         assert.deepEqual(
    //             error.error.errorMessage,
    //             'Debt payment deadline is not over.'
    //         )
    //     }




    //     await program.methods.payDebt(1)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()



    //     await program.methods.placeOrder(new anchor.BN(0)/* 0 milliseconds */, borrowAmount, debtAmount)
    //         .accounts({
    //             borrower: user1.pda,
    //             signer: user1.keypair.publicKey
    //         })
    //         .signers([user1.keypair])
    //         .rpc()

    //     await program.methods.executeOrder(3)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user2.keypair.publicKey
    //         })
    //         .signers([user2.keypair])
    //         .rpc()


    //     // borrower cannot pay off the debt in 0ms, so lender can seize the nft
    //     // however only lender can seize the nft
    //     try {
    //         await program.methods.seize(2)
    //             .accounts({
    //                 borrower: user1.pda,
    //                 lender: user3.pda,
    //                 signer: user3.keypair.publicKey
    //             })
    //             .signers([user3.keypair])
    //             .rpc()
    //     } catch (error) {
    //         assert.deepEqual(
    //             error.error.errorMessage,
    //             'Specifed lender is not the expected lender.'
    //         )
    //     }

    //     // borrower cannot pay off the debt in 0ms, so lender can seize the nft

    //     await program.methods.seize(2)
    //         .accounts({
    //             borrower: user1.pda,
    //             lender: user2.pda,
    //             signer: user2.keypair.publicKey
    //         })
    //         .signers([user2.keypair])
    //         .rpc()
    //     res = await program.account.pawnShopUser.fetch(user1.pda)
    //     assert.deepEqual(res.demoNfts, 0, 'NFT is not seized')
    //     assert.deepEqual(res.demoTokens, 108, 'money is seized')
    //     res = await program.account.pawnShopUser.fetch(user2.pda)
    //     assert.deepEqual(res.demoNfts, 2, 'NFT is not seized')
    //     assert.deepEqual(res.demoTokens, 92, 'money is seized')
    // })
})


