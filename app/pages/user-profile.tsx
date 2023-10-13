import { Main } from "@/components/Main";
import { NFTCard } from "@/components/NFTCard";
import { useDapp } from "@/contexts/DappProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export default function Profile() {
    const { publicKey } = useWallet()
    const { demoNFTsCount, demoTokensBalance, userLends, userDebts, userOrders } = useDapp()

    const availableNFTs = useMemo(() => [...Array(demoNFTsCount).keys()], [demoNFTsCount])

    return (
        <Main>
            <div className="flex flex-col gap-10">
                {availableNFTs.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-bold md:text-4xl">Your Available NFTs</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {availableNFTs.map((i) => <NFTCard key={`p${publicKey}${i}`} />)}
                        </div>
                    </div>
                )}
                {(userOrders?.at(0) || userDebts?.at(0)) && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-bold md:text-4xl">Your Unavailable NFTs</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {userOrders?.map((order, i) => <NFTCard key={`o${publicKey}${i}`} order={order} />)}
                            {userDebts?.map((debt, i) => <NFTCard key={`d${publicKey}${i}`} debt={debt} />)}
                        </div>
                    </div>
                )}
                {userLends?.at(0) && (
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-bold md:text-4xl">Debtors' NFTs</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
                            {userLends?.map((lend, i) => <NFTCard key={`l${publicKey}${i}`} lend={lend} />)}
                        </div>
                    </div>
                )}
            </div>
        </Main>
    )
}
