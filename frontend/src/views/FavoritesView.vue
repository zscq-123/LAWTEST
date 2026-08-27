<template>
  <div class="mobile-page fav-page">
    <div class="fav-head">
      <div class="fav-title">
        <star-filled style="color: #faad14" />
        我的收藏
        <span class="fav-count">{{ favorites.length }}</span>
      </div>
      <a-space :size="8">
        <a-button size="small" @click="router.push('/')">首页</a-button>
        <a-popconfirm
          title="确定清空全部收藏吗？"
          ok-text="清空"
          cancel-text="取消"
          @confirm="clearAll"
        >
          <a-button size="small" danger :disabled="!favorites.length">清空</a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <a-spin v-if="loading" class="fav-loading" size="large" />

    <a-empty v-else-if="!favorites.length" description="还没有收藏报告，快去收藏一份吧" />

    <div v-else class="fav-list">
      <div
        v-for="item in favorites"
        :key="item.code"
        class="fav-card"
        :style="{ borderLeftColor: item.report ? item.report.career.colorCode : '#999' }"
      >
        <template v-if="item.report">
          <div class="fav-main" @click="openReport(item.code)">
            <div class="fav-avatar" :style="{ background: item.report.career.colorCode }">
              {{ item.report.career.name.charAt(0) }}
            </div>
            <div class="fav-info">
              <div class="fav-name">
                {{ item.report.career.name }}
                <span class="fav-rate">{{ item.report.match.first.matchRate }}%</span>
              </div>
              <div class="fav-code">{{ item.code }}</div>
              <div class="fav-time">{{ formatTime(item.report.createdAt) }}</div>
            </div>
          </div>
          <div class="fav-actions">
            <a-button size="small" type="primary" ghost @click="openReport(item.code)">
              打开报告
            </a-button>
            <a-button size="small" danger @click="remove(item.code)">取消收藏</a-button>
          </div>
        </template>
        <template v-else>
          <div class="fav-main">
            <div class="fav-avatar failed">?</div>
            <div class="fav-info">
              <div class="fav-name">报告已失效</div>
              <div class="fav-code">{{ item.code }}</div>
            </div>
          </div>
          <div class="fav-actions">
            <a-button size="small" danger @click="remove(item.code)">移除</a-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { StarFilled } from '@ant-design/icons-vue'
import { getReport } from '@/api'
import type { Report } from '@/types'

interface FavItem {
  code: string
  report: Report | null
}

const FAV_KEY = 'lawtest_favorites'
const router = useRouter()
const loading = ref(false)
const favorites = ref<FavItem[]>([])

function readCodes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
  } catch {
    return []
  }
}

function writeCodes(codes: string[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(codes))
}

async function load() {
  loading.value = true
  const codes = readCodes()
  favorites.value = await Promise.all(
    codes.map(async (code) => {
      try {
        const report = await getReport(code)
        return { code, report }
      } catch {
        return { code, report: null }
      }
    })
  )
  loading.value = false
}

function openReport(code: string) {
  router.push(`/report/${code}`)
}

function remove(code: string) {
  favorites.value = favorites.value.filter((f) => f.code !== code)
  writeCodes(favorites.value.map((f) => f.code))
  message.success('已取消收藏')
}

function clearAll() {
  favorites.value = []
  writeCodes([])
  message.success('已清空收藏')
}

function formatTime(value?: string) {
  if (!value) return ''
  return `生成于 ${value.replace('T', ' ')}`
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.fav-page {
  padding-bottom: 40px;
}

.fav-head {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.fav-title {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fav-count {
  background: #faad14;
  color: #fff;
  border-radius: 999px;
  font-size: 12px;
  padding: 0 8px;
  line-height: 18px;
}

.fav-loading {
  display: block;
  margin: 80px auto;
}

.fav-list {
  padding: 14px 16px;
}

.fav-card {
  background: #fff;
  border-radius: 10px;
  border-left: 4px solid #1677ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 14px;
  margin-bottom: 12px;
}

.fav-main {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.fav-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.fav-avatar.failed {
  background: #d9d9d9;
}

.fav-info {
  min-width: 0;
  flex: 1;
}

.fav-name {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fav-rate {
  color: #faad14;
  font-size: 13px;
  font-weight: 700;
}

.fav-code {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 2px;
}

.fav-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
