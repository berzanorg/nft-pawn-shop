import { Main } from "@/components/Main";
import { NFTCard } from "@/components/NFTCard";
import { useNFTs } from "@/contexts/NFTsProvider";
import { usePawnShop } from "@/contexts/PawnShopProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export default function Profile() {
    const { publicKey } = useWallet()
    const { userOrders, userPawnedNFTs, userLends } = usePawnShop()
    const { nfts } = useNFTs()

    return (
        <Main>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold md:text-4xl">Your Available NFTs</h2>
                    {nfts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {nfts.map((nft) => <NFTCard key={nft.mint} kind="justNFT" data={nft} />)}
                        </div>
                    ) : <p className="font-medium text-white/60">You don't have any NFTs available.</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold md:text-4xl">Your Unavailable NFTs</h2>
                    {userOrders.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {userOrders.map((order) => <NFTCard key={order.pda.toString()} kind="userOrder" data={order} />)}
                        </div>
                    ) : <p className="font-medium text-white/60">You don't have any NFTs unavailable .</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold md:text-4xl">Your Pawned NFTs</h2>
                    {userPawnedNFTs.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {userPawnedNFTs.map((pawnedNFT, i) => <NFTCard key={pawnedNFT.pda.toString()} kind="userPawnedNFT" data={pawnedNFT} />)}
                        </div>

                    ) : <p className="font-medium text-white/60">You don't have any NFTs pawned.</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-bold md:text-4xl">NFTs You Lended For</h2>
                    {userLends.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {userLends.map((lend) => <NFTCard key={lend.pda.toString()} kind="userLend" data={lend} />)}
                        </div>
                    ) : <p className="font-medium text-white/60">You don't have any NFTs you lended for.</p>}
                </div>

            </div>
        </Main>
    )
}
