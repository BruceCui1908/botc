<template>
  <el-dialog v-model="showDialog" :title="title" width="21rem" :z-index="zIndex">
    <el-scrollbar max-height="26rem" height="26rem">
      <el-divider content-position="left">镇民</el-divider>

      <el-row>
        <div class="icon-wrapper">
          <el-tag class="icon-selector" v-for="folk in scriptStore.townsfolks" type="primary"
            @click="selectCharactor(folk)">
            {{ folk.name }}
          </el-tag>
        </div>
      </el-row>

      <el-divider content-position="left">外来者</el-divider>

      <el-row>
        <div class="icon-wrapper">
          <el-tag class="icon-selector" v-for="outsider in scriptStore.outsiders" type="primary"
            @click="selectCharactor(outsider)">
            {{ outsider.name }}
          </el-tag>
        </div>
      </el-row>

      <el-divider content-position="left">爪牙</el-divider>

      <el-row>
        <div class="icon-wrapper">
          <el-tag class="icon-selector" v-for="minion in scriptStore.minions" type="danger"
            @click="selectCharactor(minion)">
            {{ minion.name }}
          </el-tag>
        </div>
      </el-row>

      <el-divider content-position="left">恶魔</el-divider>

      <el-row>
        <div class="icon-wrapper">
          <el-tag class="icon-selector" v-for="demon in scriptStore.demons" type="danger"
            @click="selectCharactor(demon)">
            {{ demon.name }}
          </el-tag>
        </div>
      </el-row>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue'
import { useScriptStore } from '@/stores/script'
import { useSettingStore } from '@/stores/setting'
import type { Character } from '@/types/script'

const emit = defineEmits(['trigger-select'])

const scriptStore = useScriptStore()
const settingStore = useSettingStore()

const showDialog = ref<boolean>(false)
const title = ref<string>()
const zIndex = ref<number>(9999)

watch(
  () => settingStore.maxIndex,
  (maxIndex: number) => {
    if (maxIndex > zIndex.value) {
      zIndex.value = maxIndex
    }
  }
)

const toggleSelector = (playerIndex: number) => {
  showDialog.value = true
  title.value = `请为${playerIndex}号玩家分配角色`
}

const selectCharactor = (character: Character) => {
  emit('trigger-select', character)
  showDialog.value = false
}

defineExpose({ toggleSelector })
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
