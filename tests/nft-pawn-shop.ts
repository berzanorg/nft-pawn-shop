import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { NftPawnShop } from "../target/types/nft_pawn_shop"
import { assert } from "chai"

describe("nft-pawn-shop", () => {
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.NftPawnShop as Program<NftPawnShop>
    const userPublickKey = anchor.AnchorProvider.env().wallet.publicKey

    it("Sends demo assets!", async () => {
        const [pawnShopUser] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("pawn_shop_user"), userPublickKey.toBuffer()],
            program.programId
        )

        await program.methods.giveDemoAssets().accounts({
            pawnShopUser,
        }).rpc()

        const { demoNfts, demoTokens } = await program.account.pawnShopUser.fetch(pawnShopUser)

        assert.deepEqual(demoNfts, 1)
        assert.deepEqual(demoTokens, 100)
    })

    it("Places order!", async () => {
        const [borrower] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("pawn_shop_user"), userPublickKey.toBuffer()],
            program.programId
        )


        await program.methods.placeOrder(new anchor.BN(100), 10, 11).accounts({
            borrower,
        }).rpc()

        const { orders } = await program.account.pawnShopUser.fetch(borrower)
        assert.deepEqual(orders, [{
            some: {
                borrowAmount: 10,
                debtAmount: 11,
                duration: new anchor.BN(100000)
            }
        }])
    })
})
