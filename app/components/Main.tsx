import { useDapp } from "@/contexts/DappProvider";
import { ReactNode } from "react";
import { LoadingScreen } from "./LoadingScreen";

export const Main = ({ children }: { children: ReactNode }) => {
    const { isLoaded } = useDapp()


    return (
        <main className='flex flex-col self-center w-full min-h-[calc(100vh-8rem)] px-4 py-6 max-w-7xl md:min-h-[calc(100vh-4rem)]' >
            {isLoaded ? children : <LoadingScreen />}
        </main >
    )
}