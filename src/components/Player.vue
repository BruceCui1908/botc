<template>
  <div class="player-wrapper" :style="playerWrapperStyleObj" @click="touchPlayer" ref="playerRef">
    <el-card :style="cardWrapperStyle">
      <template #header>
        <div class="card-header" :style="directionObj">
          <span>{{ cardHeader }}</span>

        </div>
      </template>

      <div class="card-body" :style="directionObj">
        <Token :logo="logo" :name="name" :team="team" :size="size" :showLabel="false" @click="selectCharacter"
          :bgColor="bgColor" :style="directionObj" :isUpsideDown="isUpsideDown" class="token-container" />

        <el-scrollbar max-height="60px">
          <div class="label-container">
            <el-avatar v-for="(item, index) in tags" :key="index" :src="item.image" size="small" :style="{
              background: 'transparent',
              border: '1px grey solid'
            }" v-tippy="{
              content: item.text,
              arrow: true,
            }" @dblclick="removeTag(item)" />
            <!-- hide this button -->
            <!-- <el-button :icon="Sort" size="small" circle @click="toggleAlignment" /> -->
          </div>
        </el-scrollbar>

      </div>
      <el-button :style="switchButtonStyleObj" :icon="Switch" size="small" circle @click="switchRow" />
      <el-button :style="plusButtonStyleObj" :icon="Plus" size="small" circle @click="addReminderToList" />
    </el-card>

    <!-- hide the reminder list -->
    <!-- <div class="reminder-list" :style="reminderListStyleObj">
      <el-scrollbar :max-height="initialWrapperHeight">
        <el-tag v-for="(tag, index) in tags" :key="index" closable :disable-transitions="false" @close="removeTag(tag)"
          :type="tag.color">
          {{ tag.text }}
        </el-tag>
      </el-scrollbar>
    </div> -->
  </div>

  <CharacterSelector ref="characterSelectorRef" @trigger-select="setSelectedCharacter" />
  <ReminderSelector ref="reminderSelectorRef" @trigger-select="setSelectedReminder"
    @trigger-custom-select="setCustomSelectedReminder" @trigger-status-select="setPlayerStatus"
    @trigger-alignment-select="setPlayerAlignment" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import { Switch, Plus, Sort } from '@element-plus/icons-vue'
import Token from './Token.vue'
import CharacterSelector from './CharacterSelector.vue'
import ReminderSelector from './ReminderSelector.vue'

import { useSettingStore } from '@/stores/setting'
import { useScriptStore } from '@/stores/script'
import { usePlayerStore } from '@/stores/player'

import type { Character } from '@/types/script'
import type { PlayerInfo } from '@/types/player'
import type { Tag } from '@/types/reminder'

import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/modifiers'
import '@interactjs/dev-tools'
import interact from '@interactjs/interact'
import type { Reminder } from '@/types/reminder'

const { index } = defineProps({
  index: Number,
})

const playerRef = ref(null)
const characterSelectorRef = ref(null)
const reminderSelectorRef = ref(null)

const logo = ref('')
const name = ref('')
const team = ref('')
const isRow = ref(true)
const isUpsideDown = ref(false)
const size = ref(50)
const tags = ref<Array<Tag>>([])
const cardBodyWidth = ref('7.4rem')
const initialWrapperHeight = ref('')
const isAlive = ref(true)
const isZombie = ref(false)

const settingStore = useSettingStore()
const scriptStore = useScriptStore()
const playerStore = usePlayerStore()

const bgColor = ref<string>('rgb(242.5, 208.5, 157.5)')

const cardHeader = computed(() => `${index}号：${name.value}`)

const directionObj = computed(() => ({
  flexDirection: isRow.value ? 'row' : 'row-reverse',
}))

const playerWrapperStyleObj = computed(() => ({
  display: 'flex',
  flexDirection: isRow.value ? 'row' : 'row-reverse',
  alignItems: 'flex-start',
  position: 'relative'
}))

// const labelContainerStyleObj = computed(() => ({
//   display: 'flex',
//   justifyContent: 'flex-end',
//   alignItems: isRow.value ? 'flex-end' : 'flex-start'
// }))

const reminderListStyleObj = computed(() => {
  const style: Record<string, string> = {
    display: 'flex',
    alignItems: isRow.value ? 'flex-start' : 'flex-end',
    backgroundColor: 'transparent',
    position: 'absolute',
    flexDirection: 'column',
    transform: `translate(${isRow.value ? '100%' : '-100%'}, 0)`
  }

  if (isRow.value) {
    style.right = '0%'
  } else {
    style.left = '0%'
  }

  return style
})

const plusButtonStyleObj = computed(() => {
  const style: Record<string, string> = {
    position: 'absolute',
    bottom: '0%'
  }

  if (isRow.value) {
    style.right = '0%'
    style.transform = 'translate(50%, 50%)'
  } else {
    style.left = '0%'
    style.transform = 'translate(-50%, 50%)'
  }

  return style
})

const switchButtonStyleObj = computed(() => {
  const style: Record<string, string> = {
    position: 'absolute',
    top: '0%'
  }

  if (isRow.value) {
    style.right = '0%'
    style.transform = 'translate(50%, 50%)'
  } else {
    style.left = '0%'
    style.transform = 'translate(-50%, 50%)'
  }

  return style
})

const cardWrapperStyle = computed(() => ({
  width: cardBodyWidth.value
}))

onMounted(() => {
  const height = playerRef.value.offsetHeight
  initialWrapperHeight.value = `${height}px`

  interact(playerRef.value).draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true,
      }),
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,
      // call this function on every dragend event
      end(event) { },
    },
  })
})

function dragMoveListener(event) {
  if (settingStore.isLocked) {
    return
  }

  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  let maxIndex = getMaxZIndex('player-wrapper') + 1
  target.style.zIndex = maxIndex

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

const getMaxZIndex = (className: string) => {
  const elements = document.querySelectorAll(`.${className}`);
  let maxZ = 0;

  elements.forEach(el => {
    const z = window.getComputedStyle(el).zIndex;
    const zIndex = isNaN(parseInt(z)) ? 0 : parseInt(z);
    if (zIndex > maxZ) {
      maxZ = zIndex;
    }
  });

  return maxZ;
}

// set the player on top when click
const touchPlayer = () => {
  if (playerRef) {
    playerRef.value.style.zIndex = getMaxZIndex('player-wrapper') + 1
  }
}

// display character selector dialog
const selectCharacter = () => {
  if (!scriptStore.Meta || scriptStore.Characters.length == 0) {
    ElNotification({
      message: '请先选择剧本',
      type: 'warning',
      duration: 2000,
    })
    return
  }

  characterSelectorRef?.value?.toggleSelector(index)
}

// set props for Token and player info
const setSelectedCharacter = (character: Character) => {
  if (!index) {
    ElMessage.error(`玩家号码${index}错误`)
    return
  }

  logo.value = character.image
  name.value = character.name
  team.value = character.team

  let playerInfo: PlayerInfo = {
    index: index,
    character: character,
    firstNightOrder: character.firstNight,
    otherNightOrder: character.otherNight,
    isAlive: isAlive.value,
    isZombie: false,
    team: character.team,
    isGood: character.isGood!,
  }

  playerStore.addPlayer(playerInfo)
}

// set offical reminders old list version
const setSelectedReminder = (reminder: Reminder, label: string) => {
  let tag: Tag = {
    color: reminder.isGood ? 'primary' : 'danger',
    text: `${label}`,
    image: reminder.logo
  }

  if (!tags.value?.includes(tag)) {
    tags.value?.push(tag)
  }
}

// set custom reminders
const setCustomSelectedReminder = (label: string) => {
  let tag: Tag = {
    color: 'success',
    text: label
  }

  if (!tags.value?.includes(tag)) {
    tags.value?.push(tag)
  }
}

// set status
const setPlayerStatus = (status: string) => {
  if (status === '存活') {
    isAlive.value = true
    isZombie.value = false
  } else {
    isAlive.value = false
    isZombie.value = false
  }

  if (status === '活尸') {
    isZombie.value = true
    isAlive.value = false
  }

  if (isAlive.value) {
    bgColor.value = 'rgb(242.5, 208.5, 157.5)'
  } else if (isZombie.value) {
    bgColor.value = '#A8ABB2'
  } else {
    bgColor.value = '#606266'
  }

  playerStore.updatePlayerStatus(index ?? -1, isAlive.value, isZombie.value)
}

// set alignment
const setPlayerAlignment = (alignment: string) => {
  if (alignment === '善良') {
    isUpsideDown.value = false
  } else if (alignment === '邪恶') {
    isUpsideDown.value = true
  }
}

const removeTag = (tag: Tag) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

// toggle row and reverse
const switchRow = () => {
  isRow.value = !isRow.value
}

const addReminderToList = () => {
  if (!scriptStore.Meta || scriptStore.Characters.length == 0) {
    ElNotification({
      message: '请先选择剧本',
      type: 'warning',
      duration: 2000,
    })
    return
  }

  reminderSelectorRef?.value?.toggleSelector(index)
}

const toggleAlignment = () => {
  isUpsideDown.value = !isUpsideDown.value
}

</script>

<style lang="scss" scoped>
.player-wrapper {
  display: inline-block;
  position: relative;
  touch-action: none;
  user-select: none;

  .card-header {
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label-container {
      height: 60px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 0.1rem;
      gap: 4px;
    }
  }
}

:deep(.el-card) {
  --el-card-padding: 0.2rem;
}

:deep(.el-button) {
  margin-left: 0px;
}
</style>
