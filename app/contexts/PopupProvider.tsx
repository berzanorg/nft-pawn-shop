import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDapp } from "./DappProvider";


interface PopupContext {
    popupPawn: () => void
}

type Popup =
    | {
        kind: 'pawn'
    }
    | null

const Context = createContext<PopupContext>({
    popupPawn: () => { }
})

export const usePopup = () => useContext(Context)


export const PopupProvider = ({ children }: { children: ReactNode }) => {
    const [popup, setPopup] = useState<Popup>(null)

    const { placeOrder } = useDapp()

    const pawnNFT = useCallback(async () => {
        const duration = document.getElementById('duration') as HTMLSelectElement
        const borrow = document.getElementById('borrow') as HTMLInputElement
        const debt = document.getElementById('debt') as HTMLInputElement
        const durationAsSeconds =
            duration.value === 'Select' ? null :
                duration.value === '2 Mins' ? 2 * 60 :
                    duration.value === '1 Day' ? 24 * 60 * 60 :
                        duration.value === '1 Week' ? 7 * 24 * 60 * 60 :
                            duration.value === '2 Weeks' ? 2 * 7 * 24 * 60 * 60 :
                                duration.value === '1 Month' ? 30 * 24 * 60 * 60 :
                                    3 * 30 * 24 * 60 * 60; // `3 Months`

        if (!durationAsSeconds || !borrow.value || !debt.value || !placeOrder) return
        const borrowAmount = parseInt(borrow.value)
        const debtAmount = parseInt(debt.value)

        setPopup(null)

        await placeOrder(durationAsSeconds, borrowAmount, debtAmount)
    }, [placeOrder])

    const popupPawn = () => {
        setPopup({ kind: 'pawn' })
    }

    return (
        <Context.Provider value={{ popupPawn }}>
            {popup && (
                popup.kind === 'pawn' ? (
                    <div className="z-50 fixed flex flex-col w-full gap-2.5 p-4 -translate-x-1/2 -translate-y-1/2 border max-w-max bg-indigo-900 border-indigo-600 rounded-2xl top-1/2 left-1/2">
                        <p className="text-lg font-bold">Pawn your NFT!</p>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">Duration:</p>
                            <select id='duration' className="px-2 border rounded-lg outline-none bg-indigo-950 h-9 border-slate-600">
                                <option>Select</option>
                                <option>2 Mins</option>
                                <option>1 Day</option>
                                <option>1 Week</option>
                                <option>2 Weeks</option>
                                <option>1 Month</option>
                                <option>3 Months</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">Amount You Want:</p>
                            <input id="borrow" type="number" placeholder="10" className="px-2 font-medium border rounded-lg outline-none placeholder:text-indigo-300/30 bg-indigo-950 h-9 border-slate-600"></input>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">Amount You Will Pay:</p>
                            <input id="debt" type="number" placeholder="11" className="px-2 font-medium border rounded-lg outline-none placeholder:text-indigo-300/30 bg-indigo-950 h-9 border-slate-600"></input>
                        </div>
                        <button onClick={pawnNFT} className="px-4 text-lg font-semibold duration-200 bg-indigo-500 h-9 rounded-xl w-72 hover:bg-indigo-400 hover:scale-95 active:scale-100">Pawn Your NFT</button>
                    </div>
                ) : <></>
            )}

            {children}
        </Context.Provider>
    )
}


