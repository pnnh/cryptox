import {atomWithStorage} from 'jotai/utils'

export type CryptoHistoryItem = {
    tool: 'aes' | 'rsa'
    operation: 'encode' | 'decode'
    keyPreview: string
    resultPreview: string
    timestamp: number
}

const MAX_HISTORY = 10

export const cryptoHistoryAtom = atomWithStorage<CryptoHistoryItem[]>('cryptox-history', [], {
    getItem: (key) => {
        const stored = localStorage.getItem(key)
        if (!stored) return []
        try {
            return JSON.parse(stored) as CryptoHistoryItem[]
        } catch {
            return []
        }
    },
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem: (key) => {
        localStorage.removeItem(key)
    },
})

export function addCryptoHistoryItem(item: CryptoHistoryItem, currentHistory: CryptoHistoryItem[]): CryptoHistoryItem[] {
    const updated = [item, ...currentHistory].slice(0, MAX_HISTORY)
    return updated
}

export function removeCryptoHistoryItem(timestamp: number, currentHistory: CryptoHistoryItem[]): CryptoHistoryItem[] {
    return currentHistory.filter(item => item.timestamp !== timestamp)
}