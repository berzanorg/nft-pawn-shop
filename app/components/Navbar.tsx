import { useWallet } from "@solana/wallet-adapter-react"
import { WalletModalButton } from "@solana/wallet-adapter-react-ui"
import { IconShop } from "./IconShop"
import { IconProfile } from "./IconProfile"
import Link from "next/link"
import { useRouter } from "next/router"

export const Navbar = () => {
    const { connected, disconnect } = useWallet()
    const { pathname } = useRouter()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b xl:px-12 bg-gradient-to-bl from-slate-900 to-indigo-950 border-slate-700">

            <Link href="/" className="text-xl font-bold md:w-40">
                NFT Pawn Shop
            </Link>

            <nav className="hidden h-full gap-2 md:flex">
                <Link href="/" className={`flex flex-col items-center justify-center gap-0.5 px-4 font-bold leading-none duration-200 ${pathname === '/' ? 'text-white fill-white' : 'text-indigo-300/50 fill-indigo-300/50'} hover:scale-95`}> <IconShop /> Pawn Shop </Link>
                <Link href="/user-profile" className={`flex flex-col items-center justify-center gap-0.5 px-4 font-bold leading-none duration-200 ${pathname === '/user-profile' ? 'text-white fill-white' : 'text-indigo-300/50 fill-indigo-300/50'} hover:scale-95`}> <IconProfile /> User Profile </Link>
            </nav>

            <div className="flex justify-end md:w-40">
                {connected ? (
                    <button
                    onClick={disconnect} 
                    className="px-5 text-lg font-semibold duration-200 h-10 bg-indigo-500 hover:bg-indigo-400 rounded-2xl hover:scale-95 active:scale-90"
                    >
                        Disconnect
                    </button>
                ) : <WalletModalButton />}
            </div>
        </header>
    )
}