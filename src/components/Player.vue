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
            <el-tooltip :content="item.text" v-for="(item, index) in tags" :key="index"
              :visible="settingStore.showReminders || selectedIndexArr.includes(index)">
              <el-avatar :src="item.image" size="small" :style="{
                background: 'transparent',
                border: '1px grey solid'
              }" @dblclick="removeTag(item)" @click="toggleTooltip(index)" />
            </el-tooltip>
          </div>
        </el-scrollbar>
      </div>
      <el-button :style="switchButtonStyleObj" :icon="Switch" size="small" circle @click="switchRow" />
      <el-button :style="plusButtonStyleObj" :icon="Plus" size="small" circle @click="addReminderToList" />
    </el-card>
  </div>

  <CharacterSelector ref="characterSelectorRef" @trigger-select="setSelectedCharacter" />
  <ReminderSelector ref="reminderSelectorRef" @trigger-select="setSelectedReminder"
    @trigger-custom-select="setCustomSelectedReminder" @trigger-status-select="setPlayerStatus"
    @trigger-alignment-select="setPlayerAlignment" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import { Switch, Plus } from '@element-plus/icons-vue'
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

const { index, isPlayerAlive, isPlayerZombie, isPlayerGood, logoUrl, cName, cTeam } = defineProps({
  index: Number,
  isPlayerAlive: {
    type: Boolean,
    default: true
  },
  isPlayerZombie: {
    type: Boolean,
    default: false
  },
  isPlayerGood: {
    type: Boolean,
    default: false
  },
  logoUrl: {
    type: String,
    default: ''
  },
  cName: {
    type: String,
    default: ''
  },
  cTeam: {
    type: String,
    default: ''
  }
})

const playerRef = ref<HTMLDivElement | null>(null)
const characterSelectorRef = ref<HTMLDivElement | null>(null)
const reminderSelectorRef = ref<HTMLDivElement | null>(null)

const logo = ref<string>(logoUrl)
const name = ref<string>(cName)
const team = ref<string>(cTeam)

const isRow = ref(true)
const isUpsideDown = ref(false)
const size = ref(50)
const tags = ref<Array<Tag>>([])
const cardBodyWidth = ref('7.4rem')
const initialWrapperHeight = ref('')

const isAlive = ref<boolean>(isPlayerAlive)
const isZombie = ref<boolean>(isPlayerZombie)
const isGood = ref<boolean>(isPlayerGood)
const isCurrentPlayerInOrder = ref<boolean>(false)
const selectedIndex = ref<number>(-1); // track the clicked item's index 
const selectedIndexArr = ref<number[]>([])

const settingStore = useSettingStore()
const scriptStore = useScriptStore()
const playerStore = usePlayerStore()

const bgColor = ref<string>('rgb(242.5, 208.5, 157.5)')

const cardHeader = computed(() => `${index}号：${name.value}`)

const directionObj = computed<CSSProperties>(() => ({
  flexDirection: isRow.value ? 'row' : 'row-reverse'
}))

const playerWrapperStyleObj = computed<CSSProperties>(() => ({
  display: 'flex',
  flexDirection: isRow.value ? 'row' : 'row-reverse',
  alignItems: 'flex-start',
  position: 'relative'
}))

const plusButtonStyleObj = computed<CSSProperties>(() => {
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

const switchButtonStyleObj = computed<CSSProperties>(() => {
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

const cardWrapperStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = {
    width: cardBodyWidth.value,
    color: isCurrentPlayerInOrder.value ? 'white' : 'black'
  }

  if (isCurrentPlayerInOrder.value) {
    style.backgroundColor = isGood.value ? 'rgb(24, 103, 192)' : '#C62828'
    if (isZombie.value) {
      style.backgroundColor = '#F57C00'
    }
  } else {
    style.backgroundColor = 'white'
  }

  return style
})

// drag and drop start
onMounted(() => {
  const height = playerRef.value?.offsetHeight ?? 0
  initialWrapperHeight.value = `${height}px`

  // @ts-ignore
  interact(playerRef.value).draggable({
    // enable inertial throwing
    // @ts-ignore
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,
      // call this function on every dragend event
      end(event) { }
    }
  })
})

// @ts-ignore
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
  const elements = document.querySelectorAll(`.${className}`)
  let maxZ = 0

  elements.forEach((el) => {
    const z = window.getComputedStyle(el).zIndex
    const zIndex = isNaN(parseInt(z)) ? 0 : parseInt(z)
    if (zIndex > maxZ) {
      maxZ = zIndex
    }
  })

  return maxZ
}

// set the player on top when click
const touchPlayer = () => {
  if (playerRef) {
    let maxIndex = getMaxZIndex('player-wrapper') + 1
    // @ts-ignore
    playerRef.value.style.zIndex = maxIndex.toString()
    settingStore.setMaxZIndex(maxIndex)
  }
}
// drag and drop end

// display character selector dialog
const selectCharacter = () => {
  if (!scriptStore.meta || scriptStore.characters.length == 0) {
    ElNotification({
      message: '请先选择剧本',
      type: 'warning',
      duration: 2000
    })
    return
  }

  // @ts-ignore
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
  isGood.value = character.isGood!

  let playerInfo: PlayerInfo = {
    index: index,
    character: character,
    firstNightOrder: character.firstNight,
    otherNightOrder: character.otherNight,
    isAlive: isAlive.value,
    isZombie: false,
    team: character.team,
    isGood: character.isGood!
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
    isGood.value = true
  } else if (alignment === '邪恶') {
    isUpsideDown.value = true
    isGood.value = false
  }
}

const removeTag = (tag: Tag) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

const toggleTooltip = (index: number) => {
  selectedIndex.value = index

  if (selectedIndexArr.value.includes(index)) {
    selectedIndexArr.value = selectedIndexArr.value.filter(num => num !== index)
  } else {
    selectedIndexArr.value.push(index)
  }
}

// toggle row and reverse
const switchRow = () => {
  isRow.value = !isRow.value
}

const addReminderToList = () => {
  if (!scriptStore.meta || scriptStore.characters.length == 0) {
    ElNotification({
      message: '请先选择剧本',
      type: 'warning',
      duration: 2000
    })
    return
  }

  // @ts-ignore
  reminderSelectorRef?.value?.toggleSelector(index)
}

// hightlight selected player
watch(
  () => playerStore.nightOrderIndex,
  () => {
    isCurrentPlayerInOrder.value = playerStore.nightOrderIndex === index
  }
)

// reset player info
watch(
  () => playerStore.players.length,
  (newLength, oldLength) => {
    if (newLength == 0 && oldLength > 0) {
      clearPlayerInfo()
    }
  }
)

watch(() => settingStore.showReminders, (newValue) => {
  if (!newValue) {
    selectedIndexArr.value = []
  }
})

const clearPlayerInfo = () => {
  isAlive.value = true
  isZombie.value = false
  isGood.value = true
  logo.value = ''
  name.value = ''
  team.value = ''
  tags.value = []
  bgColor.value = 'rgb(242.5, 208.5, 157.5)'
}

const restorePlayerInfo = () => {
  let selectedPlayer = playerStore.players.find((player) => player.index === index)
  if (!selectedPlayer) {
    return
  }

  isAlive.value = selectedPlayer.isAlive
  isZombie.value = selectedPlayer.isZombie
  isGood.value = selectedPlayer.isGood
  logo.value = selectedPlayer.character.image
  name.value = selectedPlayer.character.name
  team.value = selectedPlayer.team
}

defineExpose({
  restorePlayerInfo
})
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
