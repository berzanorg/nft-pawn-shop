import { useWallet } from "@solana/wallet-adapter-react"
import { WalletModalButton } from "@solana/wallet-adapter-react-ui"
import { IconMoney } from "./IconMoney"
import { useEffect } from "react"
import { IconShop } from "./IconShop"
import { IconProfile } from "./IconProfile"
import Link from "next/link"
import { useRouter } from "next/router"
import { useDapp } from "@/contexts/DappProvider"

export const Navbar = () => {
    const { connected } = useWallet()
    const { pathname } = useRouter()
    const { demoTokensBalance } = useDapp()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b xl:px-12 bg-slate-900 border-slate-700">

            <Link href="/" className="text-xl font-bold md:w-40">
                NFT Pawn Shop
            </Link>

            <nav className="hidden h-full gap-2 md:flex">
                <Link href="/" className={`flex flex-col items-center justify-center gap-0.5 px-4 font-bold leading-none duration-200 ${pathname === '/' ? 'text-white fill-white' : 'text-slate-400 fill-slate-400'} hover:scale-95`}> <IconShop /> Pawn Shop </Link>
                <Link href="/user-profile" className={`flex flex-col items-center justify-center gap-0.5 px-4 font-bold leading-none duration-200 ${pathname === '/user-profile' ? 'text-white fill-white' : 'text-slate-400 fill-slate-400'} hover:scale-95`}> <IconProfile /> User Profile </Link>
            </nav>

            <div className="flex justify-end md:w-40">
                {connected ? (
                    <div className="flex items-center gap-1.5 text-lg font-semibold cursor-default">
                        <IconMoney /> {demoTokensBalance}
                    </div>
                ) : <WalletModalButton />}
            </div>
        </header>
    )
}