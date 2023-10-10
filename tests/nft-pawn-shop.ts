import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftPawnShop } from "../target/types/nft_pawn_shop";
import { assert } from "chai";

describe("nft-pawn-shop", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.NftPawnShop as Program<NftPawnShop>;
    const ownerPublicKey = anchor.AnchorProvider.env().wallet.publicKey;

    const [demoNftCounter] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("demo_nft_counter"), ownerPublicKey.toBuffer()],
        program.programId
    )

    it("Initializes demo NFT counter!", async () => {
        await program.methods.initializeDemoNftCounter().accounts({
            demoNftCounter
        }).rpc();
    });


    it("Sends demo NFTs!", async () => {
        const [pawnShopUser] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("pawn_shop_user"), ownerPublicKey.toBuffer()],
            program.programId
        )

        await program.methods.sendDemoNft().accounts({
            demoNftCounter,
            pawnShopUser,
        }).rpc()

        const { demoNfts } = await program.account.pawnShopUser.fetch(pawnShopUser)
        assert.deepEqual(demoNfts, [0, 1])

        const { count } = await program.account.demoNftCounter.fetch(demoNftCounter)
        assert.equal(count, 2)
    });
});
