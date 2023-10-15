import * as anchor from "@coral-xyz/anchor"
import { NftPawnShop } from "../target/types/nft_pawn_shop"
import { assert } from "chai"

describe("nft-pawn-shop", () => {
    const connection = new anchor.web3.Connection('http://127.0.0.1:8899')

    const program = anchor.workspace.NftPawnShop as anchor.Program<NftPawnShop>;

    const createUser = async () => {
        const keypair = anchor.web3.Keypair.generate();

        const tx = await connection.requestAirdrop(
            keypair.publicKey,
            anchor.web3.LAMPORTS_PER_SOL * 1
        );

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: tx
        });

        const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("pawn_shop_user"), keypair.publicKey.toBuffer()],
            program.programId
        )

        return {
            pda,
            keypair,
        }
    }


    it("All tests are passed", async () => {
        // create a user
        const [user1, user2, user3] = await Promise.all([
            createUser(),
            createUser(),
            createUser(),
        ])

        // request demo assets
        await program.methods.getDemoAssets()
            .accounts({
                pawnShopUser: user1.pda,
                signer: user1.keypair.publicKey
            }).signers([user1.keypair])
            .rpc()

        const { demoNfts, demoTokens } = await program.account.pawnShopUser.fetch(user1.pda)
        assert.deepEqual(demoNfts, 1, 'Demo NFTs count is not equal to 1')
        assert.deepEqual(demoTokens, 100, 'Demo tokens count is not equal to 100')

        await program.methods.getDemoAssets()
            .accounts({
                pawnShopUser: user2.pda,
                signer: user2.keypair.publicKey
            }).signers([user2.keypair])
            .rpc()

        await program.methods.getDemoAssets()
            .accounts({
                pawnShopUser: user3.pda,
                signer: user3.keypair.publicKey
            }).signers([user3.keypair])
            .rpc()



        const duration = new anchor.BN(1000 * 60 * 60) // 1hour
        const borrowAmount = 10
        const debtAmount = 11

        await program.methods.placeOrder(duration, borrowAmount, debtAmount)
            .accounts({
                borrower: user1.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()

        let res = await program.account.pawnShopUser.fetch(user1.pda)
        assert(res.orders[0].some.duration.eq(duration), 'Duration is not equal to 1 hour')
        assert.deepEqual(res.orders[0].some.borrowAmount, borrowAmount, 'Borrow amount is not equal to 10')
        assert.deepEqual(res.orders[0].some.debtAmount, debtAmount, 'Debt amount is not equal to 11')






        await program.methods.cancelOrder(0)
            .accounts({
                borrower: user1.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()

        res = await program.account.pawnShopUser.fetch(user1.pda)
        assert(res.orders[0].none, 'Order is not cancelled')




        await program.methods.placeOrder(duration, borrowAmount, debtAmount)
            .accounts({
                borrower: user1.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()
        res = await program.account.pawnShopUser.fetch(user1.pda)
        assert.deepEqual(res.demoNfts, 0, 'NFT is not locked')


        try {
            await program.methods.cancelOrder(1)
                .accounts({
                    borrower: user1.pda,
                    signer: user3.keypair.publicKey
                })
                .signers([user3.keypair])
                .rpc()
        } catch (error) {
            assert.deepEqual(
                error.error.errorMessage,
                'You do not have access to complete this operation.'
            )
        }


        await program.methods.executeOrder(1)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user2.keypair.publicKey
            })
            .signers([user2.keypair])
            .rpc()
        res = await program.account.pawnShopUser.fetch(user1.pda)
        assert(res.debts[0].some, 'Order is not executed')
        assert.deepEqual(res.demoTokens, 110, 'Demo tokens amount is not equal to 110')
        res = await program.account.pawnShopUser.fetch(user2.pda)
        assert.deepEqual(res.demoTokens, 90, 'Demo tokens amount is not equal to 90')


        await program.methods.payDebt(0)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()
        res = await program.account.pawnShopUser.fetch(user1.pda)
        assert(res.debts[0].none, 'Debt is not paid')
        assert.deepEqual(res.demoTokens, 99, 'Demo tokens amount is not equal to 99')
        res = await program.account.pawnShopUser.fetch(user2.pda)
        assert.deepEqual(res.demoTokens, 101, 'Demo tokens amount is not equal to 101')



        await program.methods.placeOrder(duration/*1 hour*/, borrowAmount, debtAmount)
            .accounts({
                borrower: user1.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()

        await program.methods.executeOrder(2)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user2.keypair.publicKey
            })
            .signers([user2.keypair])
            .rpc()

        // debt payment deadline is not over so lender cannot seize the nft
        try {
            await program.methods.seize(1)
                .accounts({
                    borrower: user1.pda,
                    lender: user2.pda,
                    signer: user2.keypair.publicKey
                })
                .signers([user2.keypair])
                .rpc()
        } catch (error) {
            assert.deepEqual(
                error.error.errorMessage,
                'Debt payment deadline is not over.'
            )
        }




        await program.methods.payDebt(1)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()



        await program.methods.placeOrder(new anchor.BN(0)/* 0 milliseconds */, borrowAmount, debtAmount)
            .accounts({
                borrower: user1.pda,
                signer: user1.keypair.publicKey
            })
            .signers([user1.keypair])
            .rpc()

        await program.methods.executeOrder(3)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user2.keypair.publicKey
            })
            .signers([user2.keypair])
            .rpc()


        // borrower cannot pay off the debt in 0ms, so lender can seize the nft
        // however only lender can seize the nft
        try {
            await program.methods.seize(2)
                .accounts({
                    borrower: user1.pda,
                    lender: user3.pda,
                    signer: user3.keypair.publicKey
                })
                .signers([user3.keypair])
                .rpc()
        } catch (error) {
            assert.deepEqual(
                error.error.errorMessage,
                'Specifed lender is not the expected lender.'
            )
        }

        // borrower cannot pay off the debt in 0ms, so lender can seize the nft

        await program.methods.seize(2)
            .accounts({
                borrower: user1.pda,
                lender: user2.pda,
                signer: user2.keypair.publicKey
            })
            .signers([user2.keypair])
            .rpc()
        res = await program.account.pawnShopUser.fetch(user1.pda)
        assert.deepEqual(res.demoNfts, 0, 'NFT is not seized')
        assert.deepEqual(res.demoTokens, 108, 'money is seized')
        res = await program.account.pawnShopUser.fetch(user2.pda)
        assert.deepEqual(res.demoNfts, 2, 'NFT is not seized')
        assert.deepEqual(res.demoTokens, 92, 'money is seized')
    })
})


