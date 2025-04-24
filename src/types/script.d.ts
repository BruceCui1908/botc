export interface Meta {
  id: string
  author: string
  name: string
  logo: string
  team?: string
}

export interface Character {
  id: string
  name: string
  image: string
  team: string
  ability: string
  edition?: string
  firstNight?: number
  firstNightReminder?: string
  otherNight?: number
  otherNightReminder?: string
  reminders?: string[]
  remindersGlobal?: string[]
  isGood?: boolean
}

export type Script = Meta | Character

export interface ScriptState {
  scripts: Script[]
  meta: Meta | null
  characters: Character[]
  townsfolks: Character[]
  outsiders: Character[]
  minions: Character[]
  demons: Character[]
  isGameOn: boolean
  firstNightOrders: Character[]
  otherNightOrders: Character[]
  reminders: Reminder[]
}