import { useDapp } from "@/contexts/DappProvider"
import { useWallet } from "@solana/wallet-adapter-react"
import { useCallback, useState } from "react"

export const PopupRequestDemoAssets = () => {
    const { getDemoAssets, isLoaded, demoNFTsCount, demoTokensBalance } = useDapp()
    const { connected } = useWallet()
    const [isHidden, setHidden] = useState(false)

    return (
        <>
            {!isHidden && connected && isLoaded && demoNFTsCount === 0 && demoTokensBalance === 0 && (
                <div className="fixed flex flex-col w-full gap-2.5 p-4 -translate-x-1/2 -translate-y-1/2 border max-w-max bg-slate-800 border-slate-600 rounded-2xl top-1/2 left-1/2">
                    <p className="font-semibold sm:text-lg">You can request demo assets for testing.</p>
                    <button onClick={() => { setHidden(true); getDemoAssets() }} type="button" className="font-semibold duration-200 sm:text-lg h-9 rounded-xl bg-sky-500 hover:bg-sky-400 hover:scale-95 active:scale-100">Request Demo Assets</button>
                </div>
            )}
        </>
    )
}