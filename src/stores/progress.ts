import { defineStore } from 'pinia'
import type { Status, Progress } from '@/types/progress'

export const useProgressStore = defineStore('progressStore', {
    state: (): Progress => ({
        isGameOn: false,
        timeline: [],
    }),

    actions: {
        startGame(): void {
            if (!this.isGameOn) {
                this.isGameOn = true
                if (this.timeline.length == 0) {
                    let firstDayNode: Status = {
                        index: 1,
                        isDay: false,
                        note: '...',
                        label: `第1个夜晚`,
                        isEditMode: false
                    }
                    this.timeline.push(firstDayNode)
                }

                return
            }

            let lastItem = this.timeline[this.timeline.length - 1]
            let curIndex = lastItem.isDay ? lastItem.index + 1 : lastItem.index
            let isDay = !lastItem.isDay

            let dayNode: Status = {
                index: curIndex,
                isDay: isDay,
                note: '...',
                label: `第${curIndex}个${isDay ? '白天' : '夜晚'}`,
                isEditMode: false
            }

            this.timeline.push(dayNode)
        },
        reset(): void {
            this.timeline = []
            this.isGameOn = false
        }
    },
})
