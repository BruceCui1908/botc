import { defineStore } from 'pinia'
import type { Players, PlayerInfo } from '@/types/player'
import type { Reminder } from '@/types/reminder'

export const usePlayerStore = defineStore('playerStore', {
    state: (): Players => ({
        players: [],
        reminders: [],
        nightOrderIndex: -1,
        isUpdated: false
    }),

    getters: {
        TownsfolkReminders(state): Reminder[] {
            return state.reminders.filter(item => item.team === 'townsfolk')
        },

        OutsiderReminders(state): Reminder[] {
            return state.reminders.filter(item => item.team === 'outsider')
        },

        MinionReminders(state): Reminder[] {
            return state.reminders.filter(item => item.team === 'minion')
        },

        DemonReminders(state): Reminder[] {
            return state.reminders.filter(item => item.team === 'demon')
        },
    },

    actions: {
        addPlayer(player: PlayerInfo): void {
            const index = this.players.findIndex(item => item.index === player.index)

            if (index !== -1) {
                this.players[index] = player
            } else {
                this.players.push(player)
            }

            let character = player.character
            const combinedReminders = (character.reminders ?? []).concat(character.remindersGlobal ?? []);

            if (combinedReminders.length > 0) {
                let reminder: Reminder = {
                    logo: character.image,
                    text: combinedReminders,
                    name: character.name,
                    isGood: player.isGood!,
                    team: player.team
                }
                this.reminders.push(reminder)
            }

            const seen = new Set();
            this.reminders = this.reminders.filter(item => {
                const key = `${item.name}-${item.text}`;
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });

            this.players = this.players.sort((a, b) => a.index - b.index)

            this.triggerUpdate()
        },

        updatePlayerStatus(index: number, isAlive: boolean, isZombie: boolean): void {
            const i = this.players.findIndex(item => item.index === index)
            if (i !== -1) {
                this.players[i].isAlive = isAlive
                this.players[i].isZombie = isZombie
            }
        },

        reset(): void {
            this.players = []
            this.reminders = []
            this.nightOrderIndex = -1
            this.triggerUpdate()
        },

        findPlayer(index: number): PlayerInfo | undefined {
            return this.players.find(item => item.index === index)
        },

        setNightOrderIndex(index: number) {
            this.nightOrderIndex = index
        },

        triggerUpdate(): void {
            this.isUpdated = !this.isUpdated
        }
    }
})