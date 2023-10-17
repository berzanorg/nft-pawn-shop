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
        <div className='flex font-medium flex-col self-center w-full gap-3 rounded-2xl max-w-7xl bg-[#2d3765] p-2.5'>
            <Image alt="NFT Art" src={nftImage} className="rounded-2xl" />
            {order?.account && userPda && order.account.equals(userPda) ? (
                <>
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">${order.debtAmount}</span></p>
                    <p className="leading-none text-indigo-300">Duration: <span className="text-indigo-100">{format(order.duration.toNumber())}</span></p>
                    <button onClick={cancelOrder ? () => cancelOrder(order.index) : undefined} className="h-8 font-semibold duration-200 bg-pink-500 rounded-xl hover:bg-pink-400 hover:scale-95 active:scale-100">Cancel Order</button>
                </>
            ) : order ? (
                <>
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">${order.debtAmount}</span></p>
                    <p className="leading-none text-indigo-300">Duration: <span className="text-indigo-100">{format(order.duration.toNumber())}</span></p>
                    <button onClick={executeOrder ? () => executeOrder(order.index, order.account) : undefined} className="h-8 font-semibold duration-200 bg-indigo-500 rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100">Lend ${order.borrowAmount}</button>
                </>

            ) : debt ? (
                <>
                    <p className="leading-none text-indigo-300">Your Debt: <span className="text-indigo-100">${debt.amount}</span></p>
                    <p className="leading-none text-indigo-300">Deadline: <span className="text-indigo-100">{deadline || 'done'}</span></p>
                    <button disabled={!deadline} onClick={payDebt ? () => payDebt(debt.index, debt.lenderPda) : undefined} className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100">Pay Debt</button>
                </>

            ) : lend ? (
                <>
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">${lend.amount}</span></p>
                    <p className="leading-none text-indigo-300">Deadline: <span className="text-indigo-100">{deadline || 'done'}</span></p>
                    <button disabled={Boolean(deadline)} onClick={seize ? () => seize(lend.index, lend.borrowerPda) : undefined} className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100">Seize NFT</button>
                </>
            ) : (
                <>
                    <p className="leading-none text-indigo-300">It can be pawned.</p>
                    <button onClick={popupPawn} className="h-8 font-semibold duration-200 bg-indigo-500 rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100">Pawn</button>
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