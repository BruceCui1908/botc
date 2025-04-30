import type { Reminder } from './reminder'
import type { Character } from './script'

export interface PlayerInfo {
  index: number
  character: Character
  firstNightOrder?: number
  otherNightOrder?: number
  isAlive: boolean
  isZombie: boolean
  team: string
  isGood: boolean
}

export interface Players {
  players: PlayerInfo[]
  isUpdated: boolean
  reminders: Reminder[]
  nightOrderIndex: number
}
