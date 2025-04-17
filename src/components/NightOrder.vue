<template>
    <div class="night-order-container">
        <div v-if="isInFirstNight">
            {{ firstNightOrders }}
        </div>

        <div v-if="isInOtherNight">
            {{ otherNightOrders }}
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'

const playerStore = usePlayerStore()
const progressStore = useProgressStore()

const firstNightOrders = computed(() =>
    playerStore.players.filter((item) => item.character.hasOwnProperty('firstNight')
        && item.character.firstNight !== 0)
        .sort((a, b) => a.character.firstNight! - b.character.firstNight!)
        .map((player) => ({
            label: `${player.index}: ${player.character.name}`,
            disabled: player.isAlive
        }))
)

const otherNightOrders = computed(() =>
    playerStore.players.filter((item) => item.character.hasOwnProperty('otherNight')
        && item.character.otherNight !== 0)
        .sort((a, b) => a.character.otherNight! - b.character.otherNight!)
        .map((player) => ({
            label: `${player.index}: ${player.character.name}`,
            disabled: player.isAlive
        }))
)

const isInFirstNight = computed(() => {
    let length = progressStore.timeline.length
    if (length === 0) {
        return false
    }

    let currentTimeline = progressStore.timeline[length - 1]
    return !currentTimeline.isDay && length === 1
})

const isInOtherNight = computed(() => {
    let length = progressStore.timeline.length
    if (length === 0) {
        return false
    }

    let currentTimeline = progressStore.timeline[length - 1]
    return !currentTimeline.isDay && length !== 1
})

</script>

<style lang="scss" scoped></style>