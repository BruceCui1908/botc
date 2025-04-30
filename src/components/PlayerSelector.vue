<template>
  <div class="panel-container">
    <el-row class="player-info">
      <span class="label">请选择玩家数量</span>
      <el-input-number
        v-model="num"
        :min="5"
        :max="20"
        @change="handleChange"
        :disabled="settingStore.isLocked"
      />
      <el-switch
        v-model="isLocked"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="已锁定"
        inactive-text="未锁定"
        @change="lock"
      />
    </el-row>

    <el-row class="player-info">
      <el-text type="primary">{{ tCount }}</el-text>
      <el-text type="primary">{{ oCount }}</el-text>
      <el-text type="danger">{{ mCount }}</el-text>
      <el-text type="danger">{{ dCount }}</el-text>
      <el-text type="success">{{ trCount }}</el-text>
      <el-button type="primary" :icon="Refresh" circle @click="dialogVisible = true" />
    </el-row>

    <el-dialog v-model="dialogVisible" title="重置小镇" width="20rem">
      <span>请问您是否想要重置小镇？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">停留一会儿</el-button>
          <el-button type="success" @click="clearCharacters"> 保留座位 </el-button>
          <el-button type="primary" @click="refresh"> 重置 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { useScriptStore } from '@/stores/script'
import { usePlayerStore } from '@/stores/player'
import { useProgressStore } from '@/stores/progress'

import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const settingStore = useSettingStore()
const scriptStore = useScriptStore()
const playerStore = usePlayerStore()
const progressStore = useProgressStore()

const num = ref<number>(5)
const tCount = ref<number>(0)
const oCount = ref<number>(0)
const mCount = ref<number>(0)
const dCount = ref<number>(0)
const trCount = ref<number>(0)
const isLocked = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)

watch(
  () => settingStore.PlayersCount,
  (arr) => {
    const [_, t, o, m, d, tr] = arr
    tCount.value = t
    oCount.value = o
    mCount.value = m
    dCount.value = d
    trCount.value = tr
  },
)

const handleChange = (value: number | undefined) => {
  if (value) {
    settingStore.setPlayers(value)
  }
}

const lock = (isLocked: boolean) => {
  settingStore.lock(isLocked)
}

const clearCharacters = () => {
  scriptStore.setGameEnded()
  progressStore.reset()
  playerStore.reset()
  dialogVisible.value = false
  isLocked.value = false

  ElMessage({
    message: '小镇已被重置',
    type: 'success',
    duration: 1000,
  })
}

const refresh = () => {
  settingStore.reset()
  scriptStore.setGameEnded()
  playerStore.reset()
  progressStore.reset()

  dialogVisible.value = false
  isLocked.value = false
  num.value = 5

  ElMessage({
    message: '小镇已被重置',
    type: 'success',
    duration: 1000,
  })
}
</script>

<style lang="scss" scoped>
.panel-container {
  .player-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
    gap: 1rem;
  }
}
</style>
