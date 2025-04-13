<template>
  <div class="main-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="script" title="剧本解析" v-show="!settingStore.isInTownMode">
        <JsonUpload />
        <ScriptPreviewer />
      </el-collapse-item>

      <el-collapse-item name="panel" title="玩家配置" v-show="!settingStore.isInTownMode">
        <PlayerSelector />
      </el-collapse-item>

      <el-collapse-item name="square" title="小镇广场">
        <TownSquare />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonUpload from '@/components/JsonUpload.vue'
import ScriptPreviewer from '@/components/ScriptPreviewer.vue'
import PlayerSelector from '@/components/PlayerSelector.vue'
import TownSquare from '@/components/TownSquare.vue'
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()

const activeNames = ref(['square'])
</script>

<style lang="scss" scoped></style>
