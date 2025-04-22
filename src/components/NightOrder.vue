<template>
    <div class="night-order-container">
        <v-timeline align="center" side="start" direction="horizontal">
            <v-timeline-item v-for="(item, index) in nightOrders" :key="index" size="small" dot-color="primary">
                <div>{{ item.label }}</div>
            </v-timeline-item>
        </v-timeline>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'
import type { Order } from '@/types/order'

const playerStore = usePlayerStore()
const progressStore = useProgressStore()

const firstNightOrders = ref<Order[]>([])
watch(() => playerStore.isUpdated, () => {
    firstNightOrders.value = playerStore.players.filter((item) => item.character.hasOwnProperty('firstNight')
        && item.character.firstNight !== 0)
        .sort((a, b) => a.character.firstNight! - b.character.firstNight!)
        .map((player) => ({
            label: `${player.index}号: ${player.character.name}`,
            disabled: !player.isAlive
        }))
})

const otherNightOrders = ref<Order[]>([])
watch(() => playerStore.isUpdated, () => {
    otherNightOrders.value = playerStore.players.filter((item) => item.character.hasOwnProperty('otherNight')
        && item.character.otherNight !== 0)
        .sort((a, b) => a.character.otherNight! - b.character.otherNight!)
        .map((player) => ({
            label: `${player.index}号: ${player.character.name}`,
            disabled: player.isAlive
        }))
})

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

const nightOrders = computed(() => {
    if (isInFirstNight.value) {
        return firstNightOrders.value
    } else {
        return otherNightOrders.value
    }
})

</script>

<style lang="scss" scoped>
.night-order-container {
    width: 100%;
    border: 1px red solid;
}
</style>