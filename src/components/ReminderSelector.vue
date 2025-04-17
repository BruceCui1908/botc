<template>
    <el-dialog v-model="showDialog" title="请选择角色技能标记" width="21rem" style="z-index: 9999;">
        <el-scrollbar max-height="26rem" height="26rem">
            <el-divider content-position="left">镇民</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.TownsfolkReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="primary" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">外来者</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.OutsiderReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="primary" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">爪牙</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.MinionReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="danger" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">恶魔</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.DemonReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="danger" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">自定义标签</el-divider>

            <el-row :style="customTagRowStyleObj">
                <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
                    @click="selectCustomReminder(tag)" @close="handleClose(tag)" class="custom-tag">
                    {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else size="small" @click="showInput">
                    + New Tag
                </el-button>
            </el-row>
        </el-scrollbar>
    </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useSettingStore } from '@/stores/setting'
import type { Reminder } from '@/types/reminder'

const playerStore = usePlayerStore()
const settingStore = useSettingStore()
const showDialog = ref<boolean>(false)
const dynamicTags = ref([])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const rowStyleObj = computed(() => ({
    padding: '0.2rem 0',
    gap: '0.1rem'
}))

const customTagRowStyleObj = computed(() => ({
    padding: '0.2rem 0',
    gap: '0.3rem'
}))


const emit = defineEmits(['trigger-select', 'trigger-custom-select'])

const toggleSelector = () => {
    showDialog.value = true
}

const selectReminder = (reminder: Reminder, label: string) => {
    showDialog.value = false
    emit('trigger-select', reminder, label)
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}

watch(() => settingStore.IsReseting, () => {
    dynamicTags.value = []
})

const selectCustomReminder = (tag: string) => {
    showDialog.value = false
    emit('trigger-custom-select', tag)
}


defineExpose({ toggleSelector })
</script>

<style lang="scss" scoped></style>
