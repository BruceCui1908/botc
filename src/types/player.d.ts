import type { Reminder } from "./reminder"
import type { Character } from "./script"

export interface PlayerInfo {
    index: number
    character: Character
    firstNightOrder?: number
    otherNightOrder?: number
    isAlive: boolean
    team: string
    isGood: boolean
    note: string
}

export interface Players {
    players: PlayerInfo[]
    reminders: Reminder[]
}