<template>
    <el-dialog v-model="showDialog" title="请选择角色技能标记" width="21rem" style="z-index: 9999;">
        <el-scrollbar max-height="26rem" height="26rem">
            <el-divider content-position="left">镇民</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.TownsfolkReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" :key="index" type="primary" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">外来者</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.OutsiderReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" :key="index" type="primary" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">爪牙</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.MinionReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" :key="index" type="danger" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>

            <el-divider content-position="left">恶魔</el-divider>
            <el-row :style="rowStyleObj" v-for="(reminder, index) in playerStore.DemonReminders" :key="index">
                <el-tag v-for="(item, index) in reminder.text" :key="index" type="danger" effect="dark" round>
                    {{ reminder.name }}：{{ item }}
                </el-tag>
            </el-row>
        </el-scrollbar>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()

const showDialog = ref<boolean>(false)

const rowStyleObj = computed(() => ({
    padding: '0.2rem 0',
    gap: '0.1rem'
}))

const emit = defineEmits(['trigger-select'])

const toggleSelector = () => {
    showDialog.value = true
}

defineExpose({ toggleSelector })
</script>

<style lang="scss" scoped></style>
