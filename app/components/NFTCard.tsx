import Image from "next/image"
import nftImage from '@/public/nft.png'
import { useEffect, useMemo, useState } from "react"
import { Debt, Lend, Order, useDapp } from "@/contexts/DappProvider"
import { useWallet } from "@solana/wallet-adapter-react"
import { usePopup } from "@/contexts/PopupProvider"
import { format } from "@/lib/format"

export const NFTCard = ({ order, debt, lend }: Props) => {
    const { publicKey } = useWallet()
    const { popupPawn } = usePopup()
    const { placeOrder, userPda, cancelOrder, executeOrder, payDebt, seize } = useDapp()

    const [deadline, setDeadline] = useState('')

    useEffect(() => {
        if (lend) {
            const deadlineTimestamp = lend.deadline.toNumber()
            const now = Math.round(Date.now() / 1000)
            if (now > deadlineTimestamp) setDeadline('')
            else setDeadline(format(deadlineTimestamp - now))
        }
        if (debt) {
            const deadlineTimestamp = debt.deadline.toNumber()
            const now = Math.round(Date.now() / 1000)
            if (now > deadlineTimestamp) setDeadline('')
            else setDeadline(format(deadlineTimestamp - now))
        }
    }, [lend, debt])


    return (
        <div className='flex flex-col self-center w-full gap-3 rounded-2xl bg--800 max-w-7xl bg-slate-800 p-2.5'>
            <Image alt="NFT Art" src={nftImage} className="rounded-2xl" />
            {order?.account && userPda && order.account.equals(userPda) ? (
                <>
                    <p className="leading-none text-slate-400">Will Pay: <span className="text-slate-300">${order.debtAmount}</span></p>
                    <p className="leading-none text-slate-400">Duration: <span className="text-slate-300">{format(order.duration.toNumber())}</span></p>
                    <button onClick={cancelOrder ? () => cancelOrder(order.index) : undefined} className="h-8 font-medium duration-200 rounded-xl bg-rose-500 hover:bg-rose-400 hover:scale-95 active:scale-100">Cancel Order</button>
                </>
            ) : order ? (
                <>
                    <p className="leading-none text-slate-400">Will Pay: <span className="text-slate-300">${order.debtAmount}</span></p>
                    <p className="leading-none text-slate-400">Duration: <span className="text-slate-300">{format(order.duration.toNumber())}</span></p>
                    <button onClick={executeOrder ? () => executeOrder(order.index, order.account) : undefined} className="h-8 font-medium duration-200 rounded-xl bg-sky-500 hover:bg-sky-400 hover:scale-95 active:scale-100">Lend ${order.borrowAmount}</button>
                </>

            ) : debt ? (
                <>
                    <p className="leading-none text-slate-400">Your Debt: <span className="text-slate-300">${debt.amount}</span></p>
                    <p className="leading-none text-slate-400">Deadline: <span className="text-slate-300">{deadline || 'done'}</span></p>
                    <button onClick={payDebt ? () => payDebt(debt.index, debt.lenderPda) : undefined} className="h-8 font-medium duration-200 rounded-xl bg-sky-500 hover:bg-sky-400 hover:scale-95 active:scale-100">Pay Debt</button>
                </>

            ) : lend ? (
                <>
                    <p className="leading-none text-slate-400">Will Pay: <span className="text-slate-300">${lend.amount}</span></p>
                    <p className="leading-none text-slate-400">Deadline: <span className="text-slate-300">{deadline || 'done'}</span></p>
                    <button disabled={Boolean(deadline)} onClick={seize ? () => seize(lend.index, lend.borrowerPda) : undefined} className="disabled:bg-slate-500 disabled:hover:scale-100 disabled:cursor-not-allowed h-8 font-medium duration-200 rounded-xl bg-sky-500 hover:bg-sky-400 hover:scale-95 active:scale-100">Seize NFT</button>
                </>
            ) : (
                <>
                    <p className="leading-none text-slate-400">It can be pawned.</p>
                    <button onClick={popupPawn} className="h-8 font-medium duration-200 rounded-xl bg-sky-500 hover:bg-sky-400 hover:scale-95 active:scale-100">Pawn</button>
                </>
            )}
        </div>
    )
}


type Props =
    | {
        order: Order
        debt?: undefined
        lend?: undefined
    }

    | {
        order?: undefined
        debt: Debt
        lend?: undefined
    }
    | {
        order?: undefined
        debt?: undefined
        lend: Lend
    }
    | {
        order?: undefined
        debt?: undefined
        lend?: undefined
    }