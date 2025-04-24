import { defineStore } from 'pinia'
import type { Meta, Character, Script, ScriptState } from '@/types/script'
import type { Reminder } from '@/types/reminder'

const metaIndex: string = '_meta'
const Townsfolk: string = 'townsfolk'
const Outsider: string = 'outsider'
const Minion: string = 'minion'
const Demon: string = 'demon'
const teams: string[] = [Townsfolk, Outsider, Minion, Demon]

export const useScriptStore = defineStore('scriptStore', {
  state: (): ScriptState => ({
    scripts: [],
    meta: null,
    characters: [],
    townsfolks: [],
    outsiders: [],
    minions: [],
    demons: [],
    isGameOn: false,
    firstNightOrders: [],
    otherNightOrders: [],
    reminders: []
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
      let characters = this.scripts.filter((item) => item.id !== metaIndex
        && teams.includes(item.team ?? '')) as Character[]

      characters.forEach(item => {
        if (item.team === Townsfolk || item.team === Outsider) {
          item.isGood = true
        } else {
          item.isGood = false
        }

        const combinedReminders = (item.reminders ?? []).concat(item.remindersGlobal ?? []);
        if (combinedReminders.length > 0) {
          let reminder: Reminder = {
            logo: item.image,
            text: combinedReminders,
            name: item.name,
            isGood: item.isGood!,
            team: item.team
          }
          this.reminders.push(reminder)
        }
      })

      let townsfolks = characters.filter((item) => item.team === Townsfolk) as Character[]
      let outsiders = characters.filter((item) => item.team === Outsider) as Character[]
      let minions = characters.filter((item) => item.team === Minion) as Character[]
      let demons = characters.filter((item) => item.team === Demon) as Character[]

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
  },
})
