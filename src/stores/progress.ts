import { defineStore } from 'pinia'
import type { Status, Progress } from '@/types/progress'

export const useProgressStore = defineStore('progressStore', {
    state: (): Progress => ({
        isGameOn: false,
        timeline: [],
        label: ''
    }),

    actions: {
        startGame(): void {
            let label = ''
            if (!this.isGameOn) {
                this.isGameOn = true
                if (this.timeline.length == 0) {
                    label = '第1个夜晚'
                    let firstDayNode: Status = {
                        index: 1,
                        isDay: false,
                        note: '...',
                        label: label,
                        isEditMode: false
                    }

                    this.timeline.push(firstDayNode)
                }

                return
            }

            let lastItem = this.timeline[this.timeline.length - 1]
            let curIndex = lastItem.isDay ? lastItem.index + 1 : lastItem.index
            let isDay = !lastItem.isDay

            label = `第${curIndex}个${isDay ? '白天' : '夜晚'}`
            let dayNode: Status = {
                index: curIndex,
                isDay: isDay,
                note: '...',
                label: label,
                isEditMode: false
            }

            this.timeline.push(dayNode)
            this.label = label
        },

        reset(): void {
            this.timeline = []
            this.isGameOn = false
        }
    },
})
