import { defineStore } from 'pinia'
import { usePlayerStore } from './player'
import { useProgressStore } from './progress'
import { useScriptStore } from './script'
import { useSettingStore } from './setting'
import type { Players } from '@/types/player'
import type { Progress } from '@/types/progress'
import type { ScriptState } from '@/types/script'
import type { Setting } from '@/types/setting'

interface Cache {
  players: Players
  progress: Progress
  script: ScriptState
  setting: Setting
}

const botcCacheKey: string = 'botc'

export const useCacheStore = defineStore('cacheStore', {
  actions: {
    saveToCache(): void {
      const playerStore = usePlayerStore()
      const progressStore = useProgressStore()
      const scriptStore = useScriptStore()
      const settingStore = useSettingStore()

      let cache: Cache = {
        players: playerStore.$state,
        progress: progressStore.$state,
        script: scriptStore.$state,
        setting: settingStore.$state
      }

      localStorage.setItem(botcCacheKey, JSON.stringify(cache))
    },

    restoreFromCache(): void {
      const playerStore = usePlayerStore()
      const progressStore = useProgressStore()
      const scriptStore = useScriptStore()
      const settingStore = useSettingStore()

      try {
        const cache: Cache = JSON.parse(localStorage.getItem(botcCacheKey) ?? '')

        progressStore.$state = cache.progress
        scriptStore.$state = cache.script
        settingStore.$state = cache.setting
        playerStore.$state = cache.players
        playerStore.triggerUpdate()
      } catch (err) {
        console.error(err)
      }
    }
  }
})
