<template>
  <div class="night-order-container">
    <v-timeline
      align="center"
      side="start"
      direction="horizontal"
      size="x-small"
      density="compact"
      truncate-line="both"
    >
      <v-timeline-item
        v-for="(item, index) in nightOrders"
        :key="index"
        :size="12"
        class="timeline-item-wrapper font-weight-bold"
        :dot-color="item.color"
        @click="setNightOrder(item)"
      >
        <template v-slot:default>
          <div class="title">
            <span>{{ item.title }}</span>
          </div>
          <div class="label">
            <span>{{ item.label }}</span>
          </div>
        </template>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'
import type { Order } from '@/types/order'
import { pl } from 'vuetify/locale'

const playerStore = usePlayerStore()
const progressStore = useProgressStore()

const firstNightOrders = ref<Order[]>([])
const otherNightOrders = ref<Order[]>([])
const isInFirstNight = ref<boolean>(false)
const isInOtherNight = ref<boolean>(false)
const nightOrders = ref<Order[]>([])

watch(
  () => [progressStore.timeline.length, playerStore.isUpdated],
  () => {
    let length = progressStore.timeline.length
    if (length === 0) {
      isInFirstNight.value = true
      isInOtherNight.value = false
      triggerFilterNightOrders()
      return
    }

    let currentTimeline = progressStore.timeline[length - 1]
    let isFirstNight = !currentTimeline.isDay && length === 1
    isInFirstNight.value = isFirstNight

    let isOtherNight = !currentTimeline.isDay && length > 1
    isInOtherNight.value = isOtherNight
    triggerFilterNightOrders()
  },
)

const triggerFilterNightOrders = () => {
  firstNightOrders.value = playerStore.players
    .filter((item) => item?.firstNightOrder !== 0)
    .sort((a, b) => a.firstNightOrder! - b.firstNightOrder!)
    .map((player) => {
      let order: Order = {
        title: `${player.index}号`,
        label: `${player.character.name}`,
        disabled: !player.isAlive,
        index: player.index,
      }

      if (player.isAlive) {
        order.color = player.isGood ? 'primary' : '#C62828'
      } else {
        order.color = 'grey'
      }

      if (player.isZombie) {
        order.color = '#F57C00'
        order.disabled = false
      }

      return order
    })

  otherNightOrders.value = playerStore.players
    .filter((item) => item?.otherNightOrder !== 0)
    .sort((a, b) => a.otherNightOrder! - b.otherNightOrder!)
    .map((player) => {
      let order: Order = {
        title: `${player.index}号`,
        label: `${player.character.name}`,
        disabled: !player.isAlive,
        index: player.index,
      }

      if (player.isAlive) {
        order.color = player.isGood ? 'primary' : '#C62828'
      } else {
        order.color = 'grey'
      }

      if (player.isZombie) {
        order.color = '#F57C00'
        order.disabled = false
      }

      return order
    })

  if (isInFirstNight.value) {
    nightOrders.value = firstNightOrders.value
  } else if (isInOtherNight.value) {
    nightOrders.value = otherNightOrders.value
  } else {
    nightOrders.value = []
    playerStore.setNightOrderIndex(-1)
  }
}

const setNightOrder = (order: Order) => {
  if (order.disabled) {
    return
  }
  playerStore.setNightOrderIndex(order.index)
}
</script>

<style lang="scss" scoped>
.night-order-container {
  width: 100%;
  padding: 0rem 0rem 1rem 0rem;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

::v-deep(.v-timeline--horizontal.v-timeline) {
  grid-column-gap: 0px;
}

::v-deep(.v-timeline-item) {
  .v-timeline-item__body {
    padding-block-end: 0px !important;
    padding-inline: 0.2rem;
  }
}
</style>
