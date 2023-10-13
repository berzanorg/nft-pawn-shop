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
        console.log('hey')
        const borrowAmount = parseInt(borrow.value)
        const debtAmount = parseInt(debt.value)

        setPopup(null)

        await placeOrder(durationAsSeconds, borrowAmount, debtAmount)
    }, [placeOrder])

    const popupPawn = () => {
        setPopup({ kind: 'pawn' })
    }

    useEffect(() => {
        console.log('fds')
    }, [popup])

    return (
        <Context.Provider value={{ popupPawn }}>
            {popup && (
                popup.kind === 'pawn' ? (
                    <div className="z-50 fixed flex flex-col w-full gap-2.5 p-4 -translate-x-1/2 -translate-y-1/2 border max-w-max bg-slate-800 border-slate-600 rounded-2xl top-1/2 left-1/2">
                        <p className="font-bold text-lg">Pawn your NFT!</p>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">Duration:</p>
                            <select id='duration' className="bg-slate-900 outline-none px-2 h-9 border border-slate-600 rounded-lg">
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
                            <input id="borrow" type="number" placeholder="10" className="font-medium placeholder:text-slate-600 bg-slate-900 outline-none px-2 h-9 border border-slate-600 rounded-lg"></input>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">Amount You Will Pay:</p>
                            <input id="debt" type="number" placeholder="11" className="font-medium placeholder:text-slate-600 bg-slate-900 outline-none px-2 h-9 border border-slate-600 rounded-lg"></input>
                        </div>
                        <button onClick={pawnNFT} className="font-semibold duration-200 text-lg h-9 rounded-xl bg-sky-500 px-4 w-72 hover:bg-sky-400 hover:scale-95 active:scale-100">Pawn Your NFT</button>
                    </div>
                ) : <></>
            )}

            {children}
        </Context.Provider>
    )
}


