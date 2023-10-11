import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { NftPawnShop } from "../target/types/nft_pawn_shop"
import { assert } from "chai"

describe("nft-pawn-shop", () => {
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.NftPawnShop as Program<NftPawnShop>
    const userPublickKey = anchor.AnchorProvider.env().wallet.publicKey

    const [pawnShopUser] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("pawn_shop_user"), userPublickKey.toBuffer()],
        program.programId
    )

    it("Sends demo assets!", async () => {
        await program.methods.giveDemoAssets(userPublickKey).accounts({
            pawnShopUser,
        }).rpc()

        const { demoNfts, demoTokens } = await program.account.pawnShopUser.fetch(pawnShopUser)

        assert.deepEqual(demoNfts, 1)
        assert.deepEqual(demoTokens, 100)
    })

    it("Places order!", async () => {
        const duration = new anchor.BN(100)
        const borrowAmount = 10
        const debtAmount = 11

        await program.methods.placeOrder(duration, borrowAmount, debtAmount).accounts({
            borrower: pawnShopUser,
        }).rpc()

        const { orders } = await program.account.pawnShopUser.fetch(pawnShopUser)
        console.log(orders[0].some.duration)


        assert.equal(orders.length, 1)
        assert.equal(orders[0].some.borrowAmount, borrowAmount)
        assert.equal(orders[0].some.debtAmount, debtAmount)
        assert(orders[0].some.duration.cmp(duration) === 0)
    })

    it("Cancels order!", async () => {
        const orderIndex = 0

        await program.methods.cancelOrder(orderIndex).accounts({
            borrower: pawnShopUser,
        }).rpc()

        const { orders } = await program.account.pawnShopUser.fetch(pawnShopUser)

        assert(orders[0].none)
    })
})
