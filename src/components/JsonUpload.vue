<template>
  <div class="upload-container">
    <el-upload class="upload-button" v-model:file-list="fileList" :auto-upload="false" :multiple="false" accept=".json"
      :show-file-list="false" :on-change="uploadJson">
      <template #trigger>
        <el-button type="primary">请上传剧本JSON</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Script } from '@/types/script'
import { useScriptStore } from '@/stores/script'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadRawFile, UploadUserFile, UploadFile } from 'element-plus'

const scriptStore = useScriptStore()

const fileList = ref<UploadUserFile[]>([])

const uploadJson: UploadProps['onChange'] = async (file: UploadFile) => {
  const jsonFile = file as UploadFile
  if (jsonFile.raw?.type !== 'application/json') {
    ElMessage.error('请上传JSON文件!')
    return
  }

  if (fileList.value.length > 0) {
    fileList.value = fileList.value.slice(-1)
  }

  try {
    const script = (await parseJson(jsonFile.raw)) as Script[]
    scriptStore.updateScript(script)
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

// parse UploadRawFile to json
const parseJson = (file: UploadRawFile): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string)
        resolve(json)
      } catch (err) {
        reject(new Error('剧本JSON格式错误'))
      }
    }

    reader.onerror = () => {
      reject(new Error('无法读取剧本JSON'))
    }

    reader.readAsText(file)
  })
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .upload-button {
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-self: center;
  }
}
</style>
