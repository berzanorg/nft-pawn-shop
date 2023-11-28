import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePawnShop } from "./PawnShopProvider";
import { PublicKey } from "@solana/web3.js";


interface PopupContext {
    popupPawn: (mint: string) => void
}


const Context = createContext<PopupContext>({
    popupPawn: (mint: string) => { }
})

export const usePopup = () => useContext(Context)


export const PopupProvider = ({ children }: { children: ReactNode }) => {
    const [mint, setMint] = useState<string | null>(null)

    const { placeOrder } = usePawnShop()

    const pawnNFT = useCallback(async () => {
        const duration = document.getElementById('duration') as HTMLSelectElement
        const borrow = document.getElementById('borrow') as HTMLInputElement
        const debt = document.getElementById('debt') as HTMLInputElement
        const durationInHours =
            duration.value === 'Select' ? null :
                duration.value === '1 Hour' ? 1 :
                    duration.value === '1 Day' ? 24 :
                        duration.value === '1 Week' ? 7 * 24 :
                            30 * 24; // `1 Month`

        if (!durationInHours || !borrow.value || !debt.value || !mint) return
        const borrowAmount = parseFloat(borrow.value)
        const debtAmount = parseFloat(debt.value)

        const mintAddress = new PublicKey(mint);
        setMint(null)
        await placeOrder({
            borrowAmountInSOL: borrowAmount,
            debtAmountInSOL: debtAmount,
            durationInHours: durationInHours,
            mint: mintAddress,
        })
    }, [placeOrder, mint])

    const popupPawn = (mint: string) => {
        setMint(mint)
    }

    return (
        <Context.Provider value={{ popupPawn }}>
            {mint !== null && (
                <div className="z-50 fixed flex flex-col w-full gap-2.5 p-4 -translate-x-1/2 -translate-y-1/2 border max-w-max bg-indigo-900 border-indigo-600 rounded-2xl top-1/2 left-1/2">
                    <p className="text-lg font-bold">Pawn your NFT!</p>
                    <div className="flex flex-col gap-0.5">
                        <p className="font-semibold">Duration:</p>
                        <select id='duration' className="px-2 border rounded-lg outline-none bg-indigo-950 h-9 border-slate-600">
                            <option>Select</option>
                            <option>1 Hour</option>
                            <option>1 Day</option>
                            <option>1 Week</option>
                            <option>1 Month</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="font-semibold">SOL You Want To Borrow:</p>
                        <input id="borrow" type="number" placeholder="0.2" className="px-2 font-medium border rounded-lg outline-none placeholder:text-indigo-300/30 bg-indigo-950 h-9 border-slate-600"></input>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="font-semibold">SOL You Will Pay:</p>
                        <input id="debt" type="number" placeholder="0.25" className="px-2 font-medium border rounded-lg outline-none placeholder:text-indigo-300/30 bg-indigo-950 h-9 border-slate-600"></input>
                    </div>
                    <button onClick={pawnNFT} className="px-4 text-lg font-semibold duration-200 bg-indigo-500 h-9 rounded-xl w-72 hover:bg-indigo-400 hover:scale-95 active:scale-100">Pawn Your NFT</button>
                </div>

            )}

            {children}
        </Context.Provider>
    )
}


