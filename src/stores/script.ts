import { defineStore } from 'pinia'
import type { Meta, Character, Script, ScriptState } from '@/types/script'
import type { Reminder } from '@/types/reminder'

const metaIndex: string = '_meta'
const Townsfolk: string = 'townsfolk'
const Outsider: string = 'outsider'
const Minion: string = 'minion'
const Demon: string = 'demon'
const Fabled: string = 'fabled'
const teams: string[] = [Townsfolk, Outsider, Minion, Demon, Fabled]

export const useScriptStore = defineStore('scriptStore', {
  state: (): ScriptState => ({
    scripts: [],
    meta: null,
    characters: [],
    townsfolks: [],
    outsiders: [],
    minions: [],
    demons: [],
    fabled: [],
    isGameOn: false,
    firstNightOrders: [],
    otherNightOrders: [],
    reminders: [],
    globalReminders: []
  }),

  actions: {
    updateScript(data: Array<Script>) {
      if (this.isGameOn) {
        return
      }

      this.scripts = data

      // extract meta
      let meta = this.scripts.find((item) => item.id === metaIndex) as Meta

      // extract all characters
      let characters = this.scripts.filter(
        (item) => item.id !== metaIndex && teams.includes(item.team ?? '')
      ) as Character[]

      characters.forEach((item) => {
        if (item.team === Townsfolk || item.team === Outsider) {
          item.isGood = true
        } else {
          item.isGood = false
        }

        const normalReminders = item.reminders ?? []
        if (normalReminders.length > 0) {
          let reminder: Reminder = {
            logo: item.image,
            text: normalReminders,
            name: item.name,
            isGood: item.isGood!,
            team: item.team
          }
          this.reminders.push(reminder)
          if (item.team === Fabled) {
            this.globalReminders.push(reminder)
          }
        }

        const globalReminders = item.remindersGlobal ?? []
        if (globalReminders.length > 0) {
          let reminder: Reminder = {
            logo: item.image,
            text: globalReminders,
            name: item.name,
            isGood: item.isGood!,
            team: item.team
          }
          this.globalReminders.push(reminder)
        }
      })

      console.log('reminders = ', this.reminders)
      console.log('global reminders = ', this.globalReminders)

      let townsfolks = characters.filter(
        (item) => item.team.toLowerCase() === Townsfolk.toLowerCase()
      ) as Character[]
      let outsiders = characters.filter(
        (item) => item.team.toLowerCase() === Outsider.toLowerCase()
      ) as Character[]
      let minions = characters.filter(
        (item) => item.team.toLowerCase() === Minion.toLowerCase()
      ) as Character[]
      let demons = characters.filter(
        (item) => item.team.toLowerCase() === Demon.toLowerCase()
      ) as Character[]
      let fables = characters.filter(
        (item) => item.team.toLowerCase() === Fabled.toLowerCase()
      ) as Character[]

      let firstNightCharacters = characters
        .filter((item) => item.hasOwnProperty('firstNight') && item.firstNight !== 0)
        .sort((a, b) => a.firstNight! - b.firstNight!)

      let otherNightCharacters = characters
        .filter((item) => item.hasOwnProperty('otherNight') && item.otherNight !== 0)
        .sort((a, b) => a.otherNight! - b.otherNight!)

      this.meta = meta
      this.characters = characters
      this.townsfolks = townsfolks
      this.outsiders = outsiders
      this.minions = minions
      this.demons = demons
      this.fabled = fables
      this.firstNightOrders = firstNightCharacters
      this.otherNightOrders = otherNightCharacters
    },

    reset() {
      this.scripts = []
      this.meta = null
      this.characters = []
      this.townsfolks = []
      this.outsiders = []
      this.minions = []
      this.demons = []
      this.fabled = []
      this.isGameOn = false
      this.firstNightOrders = []
      this.otherNightOrders = []
      this.reminders = []
    },

    setGameStarted() {
      this.isGameOn = true
    },

    setGameEnded() {
      this.isGameOn = false
    }
  }
})
