<template>
  <div class="mobile-page fav-page">
    <header class="fav-head">
      <div class="fav-title">
        <star-filled style="color: #e0a464" />
        我的收藏
        <a-tag color="warning" bordered class="fav-count">{{ favorites.length }}</a-tag>
      </div>
      <a-space :size="8">
        <a-button size="small" @click="router.push('/')">
          <template #icon><home-outlined /></template>
          首页
        </a-button>
        <a-popconfirm
          title="确定清空全部收藏吗？"
          ok-text="清空"
          cancel-text="取消"
          @confirm="clearAll"
        >
          <a-button size="small" danger :disabled="!favorites.length">
            <template #icon><delete-outlined /></template>
            清空
          </a-button>
        </a-popconfirm>
      </a-space>
    </header>

    <a-spin v-if="loading" class="fav-loading" size="large" />

    <a-empty
      v-else-if="!favorites.length"
      description="还没有收藏报告，快去测试并收藏一份吧"
      class="fav-empty"
    >
      <a-button type="primary" @click="router.push('/')">前往测试</a-button>
    </a-empty>

    <div v-else class="fav-list">
      <a-list :data-source="favorites" :split="false">
        <template #renderItem="{ item }">
          <a-list-item class="fav-item">
            <template v-if="item.report">
              <a-card
                class="fav-card"
                :bordered="false"
                :style="{ borderLeftColor: item.report.career.colorCode }"
                @click="openReport(item.code)"
              >
                <div class="fav-main">
                  <CareerAvatar
                    :id="item.report.career.id"
                    :name="item.report.career.name"
                    :color="item.report.career.colorCode"
                    size="md"
                  />
                  <div class="fav-info">
                    <div class="fav-name">
                      {{ item.report.career.name }}
                      <a-tag
                        :color="item.report.career.colorCode"
                        bordered
                        class="fav-tag"
                        :style="{ color: textOnColor(item.report.career.colorCode) }"
                      >
                        {{ item.report.career.matchRate || item.report.match.first.matchRate }}%
                      </a-tag>
                    </div>
                    <div class="fav-code">编号 {{ item.code }}</div>
                    <div class="fav-time">
                      <clock-circle-outlined /> 生成于 {{ formatTime(item.report.createdAt) }}
                    </div>
                  </div>
                  <right-outlined class="fav-arrow" />
                </div>
                <div class="fav-actions">
                  <a-button size="small" type="primary" ghost @click.stop="openReport(item.code)">
                    <template #icon><eye-outlined /></template>
                    打开报告
                  </a-button>
                  <a-button size="small" danger @click.stop="remove(item.code)">
                    <template #icon><delete-outlined /></template>
                    取消收藏
                  </a-button>
                </div>
              </a-card>
            </template>
            <template v-else>
              <a-card class="fav-card failed" :bordered="false">
                <div class="fav-main">
                  <div class="failed-avatar">?</div>
                  <div class="fav-info">
                    <div class="fav-name">报告已失效</div>
                    <div class="fav-code">编号 {{ item.code }}</div>
                  </div>
                </div>
                <div class="fav-actions">
                  <a-button size="small" danger @click="remove(item.code)">移除</a-button>
                </div>
              </a-card>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  RightOutlined,
  StarFilled
} from '@ant-design/icons-vue'
import CareerAvatar from '@/components/CareerAvatar.vue'
import { textOnColor } from '@/utils/color'
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
  return value.replace('T', ' ').slice(0, 16)
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
  border-bottom: 1px solid rgba(124, 154, 184, 0.16);
}

.fav-title {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1px;
}

.fav-count {
  margin: 0;
  font-weight: 600;
}

.fav-loading {
  display: block;
  margin: 80px auto;
}

.fav-empty {
  margin: 80px 16px;
}

.fav-list {
  padding: 14px 16px;
}

.fav-item {
  padding: 0 0 12px !important;
}

.fav-card {
  background: #fff;
  border-radius: 10px;
  border-left: 4px solid var(--brand-primary);
  box-shadow: 0 2px 10px rgba(124, 154, 184, 0.14);
  cursor: pointer;
  transition: all 0.25s ease;
}

.fav-card:hover {
  box-shadow: 0 6px 20px rgba(124, 154, 184, 0.20);
  transform: translateY(-2px);
}

.fav-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.failed-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(124, 154, 184, 0.20);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.fav-info {
  flex: 1;
  min-width: 0;
}

.fav-name {
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fav-tag {
  margin: 0;
  font-weight: 700;
  font-feature-settings: 'tnum';
}

.fav-code {
  font-size: 12px;
  color: rgba(52, 64, 84, 0.48);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fav-time {
  font-size: 12px;
  color: rgba(52, 64, 84, 0.42);
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fav-arrow {
  color: rgba(52, 64, 84, 0.30);
  font-size: 14px;
}

.fav-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(124, 154, 184, 0.16);
}
</style>