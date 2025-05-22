<template>
  <div class="content-preview">
    <el-descriptions border :column="2" label-width="26%">
      <template #title>
        <span>{{ scriptTitle }}</span>
      </template>
      <el-descriptions-item label="作者" rowspan="1" span="2">{{ author }}</el-descriptions-item>

      <el-descriptions-item :label="townsfolkLabel" span="2">
        <el-row class="content-row">
          <Token
            v-for="token in store.townsfolks"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :size="tokenSize"
            :name="token.name"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item :label="outsiderLabel" span="2">
        <el-row class="content-row">
          <Token
            v-for="token in store.outsiders"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :name="token.name"
            :size="tokenSize"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item :label="minionLabel" span="2">
        <el-row class="content-row">
          <Token
            v-for="token in store.minions"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :name="token.name"
            :size="tokenSize"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>
      <el-descriptions-item :label="demonLabel" span="2">
        <el-row class="content-row">
          <Token
            v-for="token in store.demons"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :name="token.name"
            :size="tokenSize"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>

      <el-descriptions-item :label="firstNightOrderLabel" span="2">
        <el-row class="content-row order">
          <Token
            v-for="token in store.firstNightOrders"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :name="token.name"
            :size="tokenSize / 2"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>

      <el-descriptions-item :label="otherNightOrderLabel" span="2">
        <el-row class="content-row order">
          <Token
            v-for="token in store.otherNightOrders"
            :key="token.id"
            :logo="token.image"
            :team="token.team"
            :name="token.name"
            :size="tokenSize / 2"
            :isPreviewReminder="true"
          />
        </el-row>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useScriptStore } from '@/stores/script'
import Token from './Token.vue'

const store = useScriptStore()

const scriptTitle = computed(() => {
  return '剧本名称：' + (store.meta?.name ?? '')
})

const author = computed(() => {
  return store.meta?.author ?? ''
})

const townsfolkLabel = computed(() => {
  return '镇民 ' + store.townsfolks.length + '个'
})

const outsiderLabel = computed(() => {
  return '外来者 ' + store.outsiders.length + '个'
})

const minionLabel = computed(() => {
  return '爪牙 ' + store.minions.length + '个'
})

const demonLabel = computed(() => {
  return '恶魔 ' + store.demons.length + '个'
})

const firstNightOrderLabel: string = '首夜顺序'
const otherNightOrderLabel: string = '其他夜顺序'

// control the size of token
const tokenSize = ref(50)
</script>

<style lang="scss" scoped>
.content-preview {
  width: 100%;

  .logo-viewer {
    height: 10rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-row {
    min-height: 4rem;

    .token-wrapper {
      padding: 0.2rem;
    }

    &.order {
      min-height: 2rem;

      .token-wrapper {
        padding: 0.3rem;
      }
    }
  }
}
</style>
