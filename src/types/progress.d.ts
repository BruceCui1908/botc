export interface Status {
  index: number
  isDay: boolean
  note: string
  label: string
  isEditMode: boolean
}

export interface Progress {
  isGameOn: boolean
  timeline: Status[]
}
