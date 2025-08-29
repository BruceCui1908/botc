<template>
  <el-dialog v-model="dialogVisible" title="恶魔信息" fullscreen :z-index="zIndex">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" v-if="minionInfoForDemon">
        <el-text class="mx-1" size="large">{{ minionInfoForDemon }}</el-text>
      </el-collapse-item>
      <el-collapse-item name="2" v-if="specialInfoForDemon">
        <el-text class="mx-1" size="large">{{ specialInfoForDemon }}</el-text>
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

const minionInfoForDemon = ref<string>('')
const specialInfoForDemon = ref<string>('')

const exposedToDemo = ref<string[]>(['提线木偶', '国王', '疯子', '侍从', '书生'])

onMounted(() => {
  prepareMinionInfoForDemon()
  prepareExposedInfoForDemon()
})

onUpdated(() => {
  prepareMinionInfoForDemon()
  prepareExposedInfoForDemon()
})

const prepareMinionInfoForDemon = () => {
  let minionPlayers = playerStore.filterMinionPlayers()

  let demonInfo = '爪牙是  '
  for (var i = 0; i < minionPlayers.length; i++) {
    let minion = minionPlayers[i]
    demonInfo += minion.index + '号'
    if (i < minionPlayers.length - 1) {
      demonInfo += ', '
    }
  }

  minionInfoForDemon.value = demonInfo
}

const prepareExposedInfoForDemon = () => {
  let specialPlayers = playerStore.filterSpecialPlayers(exposedToDemo.value)

  let specialInfo = ''
  for (var i = 0; i < specialPlayers.length; i++) {
    let player = specialPlayers[i]
    specialInfo += player.index + '号是' + player.character.name
    if (i < specialPlayers.length - 1) {
      specialInfo += ', '
    }
  }
  specialInfoForDemon.value = specialInfo
}
</script>

<style lang="scss" scoped>
.info-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
