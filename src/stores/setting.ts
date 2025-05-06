import { defineStore } from 'pinia'
import type { Setting } from '@/types/setting'

export const useSettingStore = defineStore('settingStore', {
  state: (): Setting => ({
    playersCount: 0,
    townsfolkCount: 0,
    outsiderCount: 0,
    minionCount: 0,
    demonCount: 0,
    travellerCount: 0,
    isLocked: false,
    goodColor: '#409EFF',
    evilColor: '#D90606',
    isInTownMode: false,
    isUpdated: false,
    maxIndex: -1
  }),

  getters: {
    PlayersCount(state): number[] {
      return [
        state.playersCount,
        state.townsfolkCount,
        state.outsiderCount,
        state.minionCount,
        state.demonCount,
        state.travellerCount
      ]
    }
  },

  actions: {
    setPlayers(count: number): void {
      if (this.isLocked || count < 5 || !Number.isInteger(count)) {
        return
      }

      this.playersCount = count
      if (count > 15) {
        this.travellerCount = count - 15
        count -= this.travellerCount
      } else {
        this.travellerCount = 0
      }

      // sorry, I can't figure out an algorithm to calculate the result
      this.demonCount = 1

      if (count == 5 || count == 6) {
        this.townsfolkCount = 3
        this.minionCount = 1
      }

      if (count == 7 || count == 8 || count == 9) {
        this.townsfolkCount = 5
        this.minionCount = 1
      }

      if (count == 10 || count == 11 || count == 12) {
        this.townsfolkCount = 7
        this.minionCount = 2
      }

      if (count == 13 || count == 14 || count == 15) {
        this.townsfolkCount = 9
        this.minionCount = 3
      }

      this.outsiderCount = count - this.townsfolkCount - this.minionCount - this.demonCount
    },

    lock(isLocked: boolean) {
      this.isLocked = isLocked
    },

    reset(): void {
      this.playersCount = 0
      this.townsfolkCount = 0
      this.outsiderCount = 0
      this.minionCount = 0
      this.demonCount = 0
      this.travellerCount = 0
      this.isLocked = false
      this.triggerUpdate()
    },

    setTownMode(mode: boolean): void {
      this.isInTownMode = mode
    },

    setMaxZIndex(index: number): void {
      this.maxIndex = index + 1
    },

    triggerUpdate(): void {
      this.isUpdated = !this.isUpdated
    }
  }
})
