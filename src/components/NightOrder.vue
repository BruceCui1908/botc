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
import { ref, computed, watch } from 'vue'
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
            disabled: !player.isAlive
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

const isInFirstNight = ref<boolean>(true)
const isInOtherNight = ref<boolean>(false)

watch(
    () => progressStore.timeline.length,
    () => {
        let length = progressStore.timeline.length
        if (length === 0) {
            isInFirstNight.value = true
            isInOtherNight.value = false
            return
        }

        let currentTimeline = progressStore.timeline[length - 1]
        let isFirstNight = !currentTimeline.isDay && length === 1
        isInFirstNight.value = isFirstNight

        let isOtherNight = !currentTimeline.isDay && length > 1
        isInOtherNight.value = isOtherNight
    },
)

</script>

<style lang="scss" scoped>
.night-order-container {
    width: 100%;
    border: 1px red solid;
}
</style>