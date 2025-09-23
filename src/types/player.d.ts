import type { Reminder } from './reminder'
import type { Character } from './script'
import type { Tag } from '@/types/reminder'

export interface PlayerInfo {
  index: number
  character: Character
  firstNightOrder?: number
  otherNightOrder?: number
  isAlive: boolean
  isZombie: boolean
  team: string
  isGood: boolean
  tags: Tag[]
}

export interface Players {
  players: PlayerInfo[]
  isUpdated: boolean
  reminders: Reminder[]
  nightOrderIndex: number
}
