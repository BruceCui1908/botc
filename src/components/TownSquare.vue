<template>
    <el-scrollbar>
        <NightOrder v-show="showNightOrder" />
        <div class="town-container">

            <Player v-for="i in settingStore.playersCount" :index="i" :key="i" />

            <div class="action-list">
                <v-speed-dial location="top center" transition="fade-transition">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-fab v-bind="activatorProps" size="large" density="comfortable" icon="mdi-cog"
                            color="primary"></v-fab>
                    </template>

                    <div key="4" style="position: relative">
                        <span class="text" :style="textStyleObj">行动顺序</span>
                        <v-btn icon="mdi-order-numeric-ascending" @click="toggleNightOrder"></v-btn>
                    </div>


                    <div key="3" style="position: relative">
                        <span class="text" :style="textStyleObj">时间线</span>
                        <v-btn icon="mdi-timeline-clock" @click="toggleTimeline"></v-btn>
                    </div>

                    <div key="2" style="position: relative">
                        <span class="text" :style="textStyleObj">推进游戏</span>
                        <v-btn icon="mdi-google-play" @click="startGame"></v-btn>
                    </div>

                    <div key="1" style="position: relative">
                        <span class="text" :style="textStyleObj">退出小镇</span>
                        <v-btn icon="mdi-twitter" @click="leaveTown" />
                    </div>

                    <div key="0" style="position: relative">
                        <span class="text" :style="textStyleObj">进入小镇</span>
                        <v-btn icon="mdi-all-inclusive" @click="enterTown" />
                    </div>
                </v-speed-dial>
            </div>

            <Timeline :show="showTimeline" />
        </div>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CSSProperties } from 'vue'
import Player from './Player.vue'
import Timeline from './Timeline.vue'
import NightOrder from './NightOrder.vue'
import { useSettingStore } from '@/stores/setting'
import { useProgressStore } from '@/stores/progress'
import { useScriptStore } from '@/stores/script'
import { ElMessage } from 'element-plus'

const settingStore = useSettingStore()
const progressStore = useProgressStore()
const scriptStore = useScriptStore()

const showTimeline = ref<boolean>(false)
const showNightOrder = ref<boolean>(true)

watch(() => progressStore.label, () => {
    ElMessage({
        message: progressStore.label,
        type: 'success',
        plain: true,
        duration: 3000
    })
})

const enterTown = () => {
    settingStore.setTownMode(true)
}

const leaveTown = () => {
    settingStore.setTownMode(false)
}

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

const textStyleObj = computed<CSSProperties>(() => ({
    position: 'absolute',
    zIndex: 9999,
    top: '50%',
    lineHeight: '1',
    transform: 'translate(0,-50%)',
    whiteSpace: 'nowrap',
    left: '-180%',
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
        bottom: 25%;
        z-index: 9999;
        transform: translate(50%, 50%);
    }
}
</style>
