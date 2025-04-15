<template>
  <div class="player-wrapper" @click="touchPlayer" ref="playerRef">
    <el-card>
      <template #header>
        <div class="card-header" :style="directionObj">
          <span>{{ cardHeader }}</span>
          <el-button :icon="Switch" size="small" circle @click="switchRow" />
        </div>
      </template>

      <div class="card-body" :style="directionObj">
        <Token :logo="logo" :name="name" :team="team" :size="size" :showLabel="false" @click="selectCharacter"
          :bgColor="bgColor" :style="directionObj" />

        <div class="label-container">
          <el-icon @click="addReminderToList" class="add-button" :size="14">
            <CirclePlus />
          </el-icon>
        </div>
      </div>
    </el-card>

    <div class="reminder-list" :style="isRow ? rightReminderStyle : leftReminderStyle">
      <el-tag v-for="(tag, index) in tags" :key="index" closable :disable-transitions="false" @close="removeTag(tag)"
        :type="tag.isGood ? 'primary' : 'danger'">
        {{ tag.text }}
      </el-tag>
    </div>
  </div>

  <CharacterSelector ref="characterSelectorRef" @trigger-select="setSelectedCharacter" />
  <ReminderSelector ref="reminderSelectorRef" @trigger-select="setSelectedReminder" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElNotification, ElMessage } from 'element-plus'
import { Switch } from '@element-plus/icons-vue'
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
const size = ref(60)
const tags = ref<Array<Tag>>([])

const settingStore = useSettingStore()
const scriptStore = useScriptStore()
const playerStore = usePlayerStore()

const bgColor = ref<string>('rgb(242.5, 208.5, 157.5)')
const cardHeader = computed(() => `${index}号：${name.value}`)
const directionObj = computed(() => ({
  flexDirection: isRow.value ? 'row' : 'row-reverse',
}))

onMounted(() => {
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
    isAlive: true,
    team: character.team,
    isGood: character.isGood!,
    note: ''
  }

  playerStore.addPlayer(playerInfo)
}

const setSelectedReminder = (reminder: Reminder, label: string) => {
  let tag: Tag = {
    isGood: reminder.isGood,
    text: `${reminder.name}：${label}`
  }

  if (!tags.value?.includes(tag)) {
    tags.value?.push(tag)
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

const rightReminderStyle = computed(() => ({
  zIndex: playerRef.value.style.zIndex,
  top: '0%',
  right: '0%',
}))

const leftReminderStyle = computed(() => ({
  zIndex: playerRef.value.style.zIndex,
  top: '0%',
  left: '0%',
}))

</script>

<style lang="scss" scoped>
.player-wrapper {
  width: 9rem;
  position: relative;
  touch-action: none;
  user-select: none;
  border: 1px red solid;

  .card-header {
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-body {
    display: flex;
    align-items: center;

    .label-container {
      width: 100%;
      height: 60px;
      position: relative;

      .add-button {
        position: absolute;
        bottom: 0%;
        right: 0%;
      }
    }
  }

  .reminder-list {
    position: absolute;
    background-color: transparent;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
}

:deep(.el-card) {
  --el-card-padding: 0.4rem;
}
</style>
