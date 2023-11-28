import { ReactNode } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { usePawnShop } from "@/contexts/PawnShopProvider";

export const Main = ({ children }: { children: ReactNode }) => {
    const { isLoaded } = usePawnShop()


    return (
        <main className='flex flex-col self-center w-full min-h-[calc(100vh-8rem)] px-4 py-6 max-w-7xl md:min-h-[calc(100vh-4rem)]' >
            {isLoaded ? children : <LoadingScreen />}
        </main >
    )
}