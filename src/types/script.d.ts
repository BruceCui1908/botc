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
