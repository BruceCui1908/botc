<template>
  <el-scrollbar>
    <NightOrder v-show="showNightOrder" />
    <div class="town-container">
      <Player v-for="(_, index) in settingStore.playersCount" :key="index" :index="settingStore.playersCount - index"
        :ref="(el) => setPlayerRef(el, index)" />

      <div class="action-list">
        <v-speed-dial :z-index="zIndex" location="top center" transition="fade-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-fab v-bind="activatorProps" size="large" density="comfortable" icon="mdi-cog" color="primary"></v-fab>
          </template>

          <div key="7" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">恢复</span> -->
            <v-btn prepend-icon="mdi-content-save-minus-outline" @click="restore" min-width="6rem">恢复</v-btn>
          </div>

          <div key="6" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">保存</span> -->
            <v-btn prepend-icon="mdi-content-save-plus-outline" @click="save" min-width="6rem">保存</v-btn>
          </div>

          <div key="5" style="position: relative">
            <v-btn prepend-icon="mdi-cards-club" @click="toggleReminder" min-width="6rem">切换标记</v-btn>
          </div>

          <div key="4" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">行动顺序</span> -->
            <v-btn prepend-icon="mdi-order-numeric-ascending" @click="toggleNightOrder" min-width="6rem">行动顺序</v-btn>
          </div>

          <div key="3" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">时间线</span> -->
            <v-btn prepend-icon="mdi-timeline-clock" @click="toggleTimeline" min-width="6rem">时间线</v-btn>
          </div>

          <div key="2" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">推进游戏</span> -->
            <v-btn prepend-icon="mdi-google-play" @click="startGame" min-width="6rem">推进游戏</v-btn>
          </div>

          <div key="1" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">退出小镇</span> -->
            <v-btn prepend-icon="mdi-twitter" @click="leaveTown" min-width="6rem">退出小镇</v-btn>
          </div>

          <div key="0" style="position: relative">
            <!-- <span class="text" :style="textStyleObj">进入小镇</span> -->
            <v-btn prepend-icon="mdi-all-inclusive" @click="enterTown" min-width="6rem">进入小镇</v-btn>
          </div>
        </v-speed-dial>
      </div>

      <Timeline :show="showTimeline" />
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import Player from './Player.vue'
import Timeline from './Timeline.vue'
import NightOrder from './NightOrder.vue'
import { useSettingStore } from '@/stores/setting'
import { useProgressStore } from '@/stores/progress'
import { useScriptStore } from '@/stores/script'
import { useCacheStore } from '@/stores/cache'
import { ElMessage } from 'element-plus'

const settingStore = useSettingStore()
const progressStore = useProgressStore()
const scriptStore = useScriptStore()
const cacheStore = useCacheStore()

const showTimeline = ref<boolean>(false)
const showNightOrder = ref<boolean>(true)
const zIndex = ref<number>(4000)

const playerRefs = ref([])

// @ts-ignore
const setPlayerRef = (el, index) => {
  if (el) {
    // @ts-ignore
    playerRefs.value[index] = el
  }
}

watch(
  () => progressStore.label,
  () => {
    displayLabel(progressStore.label)
  }
)

watch(
  () => settingStore.maxIndex,
  (maxIndex: number) => {
    if (maxIndex > zIndex.value) {
      zIndex.value = maxIndex
    }
  }
)

const enterTown = () => {
  settingStore.setTownMode(true)
}

const leaveTown = () => {
  settingStore.setTownMode(false)
}

// push game to next stage
const startGame = () => {
  if (settingStore.playersCount == 0) {
    return
  }

  scriptStore.setGameStarted()
  progressStore.startGame()
}

const toggleTimeline = () => {
  showTimeline.value = !showTimeline.value
}

const toggleNightOrder = () => {
  showNightOrder.value = !showNightOrder.value
}

const toggleReminder = () => {
  settingStore.toggleDisplayReminders()
}

const save = () => {
  cacheStore.saveToCache()
}

const restore = async () => {
  cacheStore.restoreFromCache()

  // waiting for players to render
  await nextTick()

  playerRefs.value.forEach((player) => {
    // @ts-ignore
    player.restorePlayerInfo()
  })
}

const displayLabel = (label: string) => {
  ElMessage({
    message: label,
    type: 'success',
    plain: true,
    duration: 3000
  })
}

const textStyleObj = computed<CSSProperties>(() => ({
  position: 'absolute',
  zIndex: 9999,
  top: '50%',
  lineHeight: '1',
  transform: 'translate(0,-50%)',
  whiteSpace: 'nowrap',
  left: '-180%'
}))
</script>

<style lang="scss" scoped>
.town-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-items: center;
  gap: 0.8rem;
  width: 100%;
  height: 60rem;
  position: relative;
  overflow: visible;

  .action-list {
    position: fixed;
    right: 50%;
    bottom: 13%;
    z-index: 9999;
    transform: translate(50%, 50%);
  }
}
</style>
