import { useRouter } from "next/router"
import { IconProfile } from "./IconProfile"
import { IconShop } from "./IconShop"
import Link from "next/link"

export const Bottombar = () => {
    const { pathname } = useRouter()

    return (
        <footer className="sticky bottom-0 z-30 flex items-center justify-between h-16 px-4 border-t md:hidden xl:px-12 bg-slate-900 border-slate-700">
            <Link href="/" className={`flex flex-col w-full items-center justify-center gap-0.5 px-4 font-medium leading-none duration-200 ${pathname === '/' ? 'text-white fill-white' : 'text-slate-400 fill-slate-400'} active:scale-90`}>
                <IconShop /> Pawn Shop
            </Link>
            <Link href="/user-profile" className={`flex flex-col w-full items-center justify-center gap-0.5 px-4 font-medium leading-none duration-200 ${pathname === '/user-profile' ? 'text-white fill-white' : 'text-slate-400 fill-slate-400'} active:scale-90`}>
                <IconProfile /> User Profile
            </Link>

        </footer>
    )
}