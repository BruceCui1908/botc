<template>
  <el-dialog v-model="dialogVisible" title="爪牙信息" fullscreen :z-index="zIndex">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" v-if="demonInfoForMinion">
        <el-text class="mx-1" size="large">{{ demonInfoForMinion }}</el-text>
      </el-collapse-item>

      <el-collapse-item name="2" v-if="specialInfoForMinion">
        <el-text class="mx-1" size="large">{{ specialInfoForMinion }}</el-text>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, watch, ref } from 'vue'
import { usePlayerStore } from '@/stores/player'

const activeNames = ref(['1', '2'])

const { show } = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

watch(
  () => show,
  () => {
    dialogVisible.value = true
  }
)

const dialogVisible = ref<boolean>(show)
const zIndex = ref<number>(9999)
const playerStore = usePlayerStore()

const demonInfoForMinion = ref<string>('')
const specialInfoForMinion = ref<string>('')

const exposedToMinion = ref<string[]>(['落难少女'])

onMounted(() => {
  prepareDemonInfoForMinion()
  prepareSpecialInfoForMinion()
})

onUpdated(() => {
  prepareDemonInfoForMinion()
  prepareSpecialInfoForMinion()
})

const prepareDemonInfoForMinion = () => {
  let demonPlayers = playerStore.filterDemonPlayers()

  let demonInfo = '恶魔是  '
  for (var i = 0; i < demonPlayers.length; i++) {
    let minion = demonPlayers[i]
    demonInfo += minion.index + '号'
    if (i < demonPlayers.length - 1) {
      demonInfo += ', '
    }
  }

  demonInfoForMinion.value = demonInfo
}

const prepareSpecialInfoForMinion = () => {
  let specialPlayers = playerStore.filterSpecialPlayers(exposedToMinion.value)

  let specialInfo = ''
  for (var i = 0; i < specialPlayers.length; i++) {
    let player = specialPlayers[i]
    specialInfo += player.character.name + '在场'
    if (i < specialPlayers.length - 1) {
      specialInfo += ', '
    }
  }
  specialInfoForMinion.value = specialInfo
}
</script>

<style lang="scss" scoped>
.info-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
