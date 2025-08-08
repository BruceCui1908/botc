<template>
    <el-dialog v-model="dialogVisible" title="请选择你想展示的信息" fullscreen :z-index="zIndex">
        <el-divider content-position="left"></el-divider>
        <div class="info-wrapper">
            <el-button type="primary" @click="switchImage(1)">你是</el-button>
            <el-button type="success" @click="switchImage(2)">你是否需要发动能力</el-button>
            <el-button type="info" @click="switchImage(3)">他的角色是</el-button>
            <el-button type="warning" @click="switchImage(4)">选择一个玩家一个角色</el-button>
            <el-button type="danger" @click="switchImage(5)">他的能力对你生效</el-button>
        </div>

        <el-divider content-position="left"></el-divider>

        <el-image :style="imgStyleObj" :src="imageUrl" />

    </el-dialog>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import type { CSSProperties } from 'vue'
import pic1 from '@/assets/info/pic_1.jpg'
import pic2 from '@/assets/info/pic_2.jpg'
import pic3 from '@/assets/info/pic_3.jpg'
import pic4 from '@/assets/info/pic_4.jpg'
import pic5 from '@/assets/info/pic_5.jpg'

const imgStyleObj = computed<CSSProperties>(() => {
    const style: Record<string, string> = {
        width: '100%',
        height: 'auto',
        display: 'block'
    }
    return style
})

const { show } = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const imageUrl = ref<string>(pic1)

const dialogVisible = ref<boolean>(show)
const zIndex = ref<number>(9999)

watch(
    () => show,
    () => {
        dialogVisible.value = true
    }
)

const infoMap = ref(new Map([
    ['1', pic1],
    ['2', pic2],
    ['3', pic3],
    ['4', pic4],
    ['5', pic5]
]))

const switchImage = (label: number) => {
    let image = infoMap.value.get(label.toString())
    console.log('image is ', image)
    imageUrl.value = image ?? ''
}

</script>

<style lang="scss" scoped>
.info-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>