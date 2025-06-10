<template>
  <div class="token-wrapper">
    <el-avatar
      class="token-avatar"
      :class="{ 'is-reminder': isReminder }"
      :size="size"
      :src="logo"
      :style="tokenStyleObj"
      v-tippy="{
        content: name,
        arrow: true,
        onShow: () => showLabel
      }"
    />

    <div v-if="isReminder" class="text-wrapper">
      <svg viewBox="0 0 150 150" class="name">
        <path d="M 13 75 C 13 160, 138 160, 138 75" id="curve" fill="transparent" />
        <text width="150" x="66.6%" text-anchor="middle" class="label mozilla" font-size="110%">
          <textPath xlink:href="#curve">
            {{ name }}
          </textPath>
        </text>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import characterBackgroundImage from '@/assets/life.png'
import { useSettingStore } from '@/stores/setting'

const { logo, team, name, size, showLabel, bgColor, isUpsideDown, isReminder, isPreviewReminder } =
  defineProps({
    logo: String,
    team: String,
    name: String,
    size: Number,
    showLabel: {
      type: Boolean,
      default: true
    },
    bgColor: {
      type: String,
      default: 'rgb(250, 236.4, 216)'
    },
    isUpsideDown: {
      type: Boolean,
      default: false
    },
    isReminder: {
      type: Boolean,
      default: false
    },
    isPreviewReminder: {
      type: Boolean,
      default: false
    }
  })

const settingStore = useSettingStore()

const tokenStyleObj = computed<CSSProperties>(() => {
  const style: Record<string, string> = {}

  if (!isPreviewReminder && !isReminder) {
    // style.background = `url(${characterBackgroundImage}) center center`
    // style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'
    style.background = bgColor
  } else {
    style.backgroundColor = bgColor
  }

  if (isUpsideDown) {
    style.transform = 'rotate(180deg)'
  } else {
    style.transform = 'rotate(0deg)'
  }

  if (isReminder && team) {
    if (settingStore.isTeamGood(team)) {
      style.backgroundColor = settingStore.goodColor
    }

    if (settingStore.isTeamEvil(team)) {
      style.backgroundColor = settingStore.evilColor
    }
  }

  return style
})
</script>

<style lang="scss" scoped>
.token-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-size: 100%;
  cursor: pointer;
  transition: border-color 250ms;
  position: relative;

  .text-wrapper {
    position: absolute;
    top: 0%;
    left: 0%;
    border-radius: 50%;

    .name {
      width: 100%;
      height: 100%;
      font-size: 1.5rem; // svg fonts are relative to document font size

      .label {
        fill: black;
      }
    }
  }
}

:deep(.el-avatar) {
  &.is-reminder {
    img {
      transform: translateY(-0.1rem);
    }
  }
}
</style>
