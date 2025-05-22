export interface Reminder {
  logo: string
  name: string
  text: string[]
  isGood: boolean
  team: string
}

export interface Tag {
  color: string
  image?: string
  text: string
  isCustom: boolean
  team: string
}
