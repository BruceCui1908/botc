import { defineStore } from 'pinia'
import type { Players, PlayerInfo } from '@/types/player'
import type { Reminder } from '@/types/reminder'

export const usePlayerStore = defineStore('playerStore', {
    state: (): Players => ({
        players: [],
        isUpdated: false,
        reminders: [],
        nightOrderIndex: -1
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
            this.isUpdated = !this.isUpdated
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
        },

        updatePlayerStatus(index: number, isAlive: boolean, isZombie: boolean): void {
            const i = this.players.findIndex(item => item.index === index)
            if (i !== -1) {
                this.players[i].isAlive = isAlive
                this.players[i].isZombie = isZombie
                this.isUpdated = !this.isUpdated
            }
        },

        reset(): void {
            this.isUpdated = !this.isUpdated
            this.players = []
            this.reminders = []
            this.nightOrderIndex = -1
        },

        setNightOrderIndex(index: number) {
            this.nightOrderIndex = index
        }
    }
})