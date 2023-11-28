import { usePopup } from "@/contexts/PopupProvider"
import { formatDeadline, formatDuration, formatLamports } from "@/lib/utils"
import { Order, usePawnShop } from "@/contexts/PawnShopProvider"
import { NFT } from "@/contexts/NFTsProvider"

export const NFTCard = ({ kind, data }: Props) => {
    const { popupPawn } = usePopup()
    const { executeOrder, payDebt, seizeNFT } = usePawnShop()

    return (
        <div className='flex font-medium flex-col self-center w-full gap-3 rounded-2xl max-w-7xl bg-[#2d3765] p-2.5'>
            {kind === 'order' ? (
                <>
                    <img className="rounded-2xl" src={data.image} alt="NFT art" />
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">{formatLamports(data.debtAmount)}</span></p>
                    <p className="leading-none text-indigo-300">Duration: <span className="text-indigo-100">{formatDuration(data.duration.toNumber())}</span></p>
                    <button
                        onClick={() => executeOrder({ customer: data.customer, mint: data.mint, orderPda: data.pda })}
                        className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100"
                    >
                        Lend {formatLamports(data.borrowAmount)}
                    </button>
                </>
            ) : kind === 'userOrder' ? (
                <>
                    <img className="rounded-2xl" src={data.image} alt="NFT art" />
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">{formatLamports(data.debtAmount)}</span></p>
                    <p className="leading-none text-indigo-300">Duration: <span className="text-indigo-100">{formatDuration(data.duration.toNumber())}</span></p>
                    <button
                        disabled
                        className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100"
                    >
                        Your Order
                    </button>
                </>
            ) : kind === 'userPawnedNFT' ? (
                <>
                    <img className="rounded-2xl" src={data.image} alt="NFT art" />
                    <p className="leading-none text-indigo-300">Your Debt: <span className="text-indigo-100">{formatLamports(data.debtAmount)}</span></p>
                    <p className="leading-none text-indigo-300">Deadline: <span className="text-indigo-100">{formatDeadline(data.deadline as any) || 'done'}</span></p>
                    <button
                        disabled={!formatDeadline(data.deadline as any)}
                        onClick={() => payDebt({ mint: data.mint, pawnbroker: data.pawnBroker as any })}
                        className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100"
                    >
                        Pay Debt
                    </button>
                </>
            ) : kind === 'userLend' ? (
                <>
                    <img className="rounded-2xl" src={data.image} alt="NFT art" />
                    <p className="leading-none text-indigo-300">Will Pay: <span className="text-indigo-100">{formatLamports(data.debtAmount)}</span></p>
                    <p className="leading-none text-indigo-300">Deadline: <span className="text-indigo-100">{formatDeadline(data.deadline as any) || 'done'}</span></p>
                    <button
                        disabled={!!formatDeadline(data.deadline as any)}
                        onClick={() => seizeNFT({ mint: data.mint, customer: data.customer })}
                        className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100"
                    >
                        Seize NFT
                    </button>
                </>
            ) : (
                <>
                    <img className="rounded-2xl" src={data.imageUri} alt="NFT art" />
                    <p className="leading-none text-indigo-300">It can be pawned.</p>
                    <button
                        onClick={() => popupPawn(data.mint)}
                        className="h-8 font-semibold duration-200 bg-indigo-500 disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl hover:bg-indigo-400 hover:scale-95 active:scale-100"
                    >
                        Pawn
                    </button>
                </>
            )}
        </div>
    )
}

type Props =
    | {
        kind: 'order',
        data: Order,
    }

    | {
        kind: 'userOrder',
        data: Order,
    }
    | {
        kind: 'userPawnedNFT',
        data: Order,
    }
    | {
        kind: 'userLend',
        data: Order,
    }
    | {
        kind: 'justNFT',
        data: NFT
    }