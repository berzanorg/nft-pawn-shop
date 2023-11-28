import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import BN from "bn.js"

export const formatDuration = (sec: number) => {
    const MINUTE = 60
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR
    const WEEK = 7 * DAY
    const MONTH = 30 * DAY


    if (sec < MINUTE) {
        return '1 min'
    } else if (sec < HOUR) {
        return `${Math.floor(sec / MINUTE)} mins`
    } else if (sec < DAY) {
        return `${Math.floor(sec / HOUR)} hours`
    } else if (sec < WEEK) {
        return `${Math.floor(sec / DAY)} days`
    } else if (sec < MONTH) {
        return `${Math.floor(sec / WEEK)} weeks`
    } else {
        return `${Math.floor(sec / MONTH)} months`
    }
}

export const formatLamports = (lamports: BN) => {
    console.log(lamports.toNumber())
    return `${(lamports.toNumber() / LAMPORTS_PER_SOL).toFixed(2)} SOL`
}

export const formatDeadline = (deadline: BN) => {
    const now = Date.now() / 1000
    const duration = deadline.toNumber() - now
    if (duration > 0) return formatDuration(duration)
    else return null
}