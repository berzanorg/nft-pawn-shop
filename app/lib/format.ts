export const format = (sec: number) => {
    const MINUTE = 60
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR
    const WEEK = 7 * DAY
    const MONTH = 30 * DAY


    if (sec < MINUTE) {
        return '1 min'
    } else if (sec < HOUR) {
        return `${Math.floor(sec / MINUTE)} min`
    } else if (sec < DAY) {
        return `${Math.floor(sec / HOUR)} hour`
    } else if (sec < WEEK) {
        return `${Math.floor(sec / DAY)} day`
    } else if (sec < MONTH) {
        return `${Math.floor(sec / WEEK)} week`
    } else {
        return `${Math.floor(sec / MONTH)} month`
    }
}