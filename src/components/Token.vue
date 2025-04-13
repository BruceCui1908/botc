<template>
  <div class="token-wrapper">
    <el-avatar class="token-avatar" :size="size" :src="logo" :style="{
      backgroundColor: bgColor,
    }" v-tippy="{
      content: name,
      arrow: true,
      onShow: () => showLabel,
    }" />
  </div>
</template>

<script lang="ts" setup>
const { logo, team, name, size, showLabel, bgColor } = defineProps({
  logo: String,
  team: String,
  name: String,
  size: Number,
  showLabel: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: 'rgb(250, 236.4, 216)',
  },
})
</script>

<style lang="scss" scoped>
.token-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
