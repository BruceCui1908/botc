<template>
  <el-dialog class="timeline-container" v-model="dialogVisible" title="时间线" width="20rem">
    <el-scrollbar height="25rem">
      <el-timeline style="max-width: 80%">
        <el-timeline-item
          v-for="(item, index) in progressStore.timeline"
          :key="index"
          :timestamp="item.label"
          placement="top"
          :type="index + 1 < progressStore.timeline.length ? 'success' : 'primary'"
          :hollow="index + 1 === progressStore.timeline.length"
        >
          <el-card>
            <el-input
              @blur="item.isEditMode = !item.isEditMode"
              v-if="item.isEditMode"
              v-model="item.note"
              :rows="2"
              type="textarea"
            />
            <el-text @click="item.isEditMode = !item.isEditMode" v-else>{{ item.note }}</el-text>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

const { show } = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const dialogVisible = ref<boolean>(show)

watch(
  () => show,
  () => {
    dialogVisible.value = true
  },
)
</script>

<style lang="scss" scoped></style>
