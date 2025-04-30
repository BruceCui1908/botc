<template>
    <el-dialog v-model="showDialog" title="请选择角色技能标记" width="21rem" style="z-index: 9999;">
        <el-scrollbar max-height="26rem" height="26rem">
            <el-divider content-position="left">镇民</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.TownsfolkReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="primary" effect="dark" round>
                    {{ reminder.name }}({{ item }})
                </el-tag>
            </el-row>

            <el-divider content-position="left">外来者</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.OutsiderReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="primary" effect="dark" round>
                    {{ reminder.name }}({{ item }})
                </el-tag>
            </el-row>

            <el-divider content-position="left">爪牙</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.MinionReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="danger" effect="dark" round>
                    {{ reminder.name }}({{ item }})
                </el-tag>
            </el-row>

            <el-divider content-position="left">恶魔</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.DemonReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" @click="selectReminder(reminder, item)" :key="index"
                    type="danger" effect="dark" round>
                    {{ reminder.name }}({{ item }})
                </el-tag>
            </el-row>

            <el-divider content-position="left">阵营</el-divider>
            <el-row :style="customTagRowStyleObj">
                <el-tag v-for="(item, index) in alignmentList" @click="selectAlignment(item)" :key="index">
                    {{ item }}</el-tag>
            </el-row>

            <el-divider content-position="left">状态</el-divider>
            <el-row :style="customTagRowStyleObj">
                <el-tag v-for="(item, index) in statusList" @click="selectStatus(item)" :key="index">
                    {{ item }}</el-tag>
            </el-row>

            <!-- <el-divider content-position="left">自定义标签</el-divider>
            <el-row :style="customTagRowStyleObj">
                <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
                    @click="selectCustomReminder(tag)" class="custom-tag">
                    {{ tag }}
                </el-tag>
                <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small"
                    @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else size="small" @click="showInput">
                    + New Tag
                </el-button>
            </el-row> -->
        </el-scrollbar>
    </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, computed, watch } from 'vue'
import type { InputInstance } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import { useSettingStore } from '@/stores/setting'
import type { Reminder } from '@/types/reminder'

const playerStore = usePlayerStore()
const settingStore = useSettingStore()
const showDialog = ref<boolean>(false)
const dynamicTags = ref<string[]>([])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()
const alignmentList = ref(['善良', '邪恶'])
const statusList = ref(['存活', '死亡', '活尸'])

const rowStyleObj = computed(() => ({
    padding: '0.2rem 0',
    gap: '0.1rem'
}))

const customTagRowStyleObj = computed(() => ({
    padding: '0.2rem 0',
    gap: '0.3rem'
}))

watch(() => settingStore.isUpdated, () => {
    dynamicTags.value = []
})

const emit = defineEmits(['trigger-select', 'trigger-custom-select',
    'trigger-status-select', 'trigger-alignment-select'])

const toggleSelector = () => {
    showDialog.value = true
}

const selectReminder = (reminder: Reminder, label: string) => {
    showDialog.value = false
    emit('trigger-select', reminder, label)
}

const selectStatus = (status: string) => {
    showDialog.value = false
    emit('trigger-status-select', status)
}

const selectAlignment = (alignment: string) => {
    showDialog.value = false
    emit('trigger-alignment-select', alignment)
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

const selectCustomReminder = (tag: string) => {
    showDialog.value = false
    emit('trigger-custom-select', tag)
}

defineExpose({ toggleSelector })
</script>

<style lang="scss" scoped></style>
