<template>
  <div class="qr-panel">
    <div class="qr-title">扫码带走你的职业画像</div>
    <div class="qr-subtitle">手机扫码即可查看、保存与收藏专属报告</div>

    <div class="qr-glow">
      <span class="qr-ring" :style="{ borderColor: careerColor }" />
      <span class="qr-ring-2" :style="{ borderColor: careerColor }" />
      <div class="qr-box">
        <img :src="report.qrImage" alt="报告二维码" class="qr-img" />
      </div>
    </div>

    <div class="qr-meta">
      <a-tag
        :color="careerColor"
        bordered
        class="qr-tag"
        :style="{ color: textOnColor(careerColor) }"
      >{{ report.career.name }}</a-tag>
      <span class="qr-code-label">编号</span>
      <span class="qr-code">{{ report.code }}</span>
    </div>

    <a-space direction="vertical" :size="10" class="qr-actions">
      <a-button block type="primary" size="large" class="btn-primary-glow" @click="copyLink">
        <template #icon><copy-outlined /></template>
        复制报告链接
      </a-button>
      <div class="qr-tip">
        <info-circle-outlined />
        长按二维码可识别 · 报告内容将自动同步至你的收藏
      </div>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { textOnColor } from '@/utils/color'
import type { Report } from '@/types'

const props = defineProps<{
  report: Report
}>()

const careerColor = computed(() => props.report.career.colorCode)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.report.qrUrl)
    message.success('报告链接已复制')
  } catch {
    message.warning('复制失败，请长按链接手动复制')
  }
}
</script>

<style scoped>
.qr-panel {
  text-align: center;
  padding: 8px 0;
}

.qr-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 1px;
}

.qr-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
  letter-spacing: 0.5px;
}

.qr-glow {
  position: relative;
  display: inline-block;
  margin: 24px 0 18px;
}

.qr-ring,
.qr-ring-2 {
  position: absolute;
  inset: -16px;
  border: 2px dashed;
  border-radius: 24px;
  pointer-events: none;
}

.qr-ring {
  animation: qrRing 9s linear infinite;
  opacity: 0.55;
}

.qr-ring-2 {
  inset: -28px;
  border-style: dotted;
  animation: qrRing 14s linear infinite reverse;
  opacity: 0.3;
}

.qr-box {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  display: inline-block;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.qr-img {
  width: 220px;
  height: 220px;
  display: block;
}

.qr-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  border-radius: 999px;
  background: var(--bg-panel-strong);
  border: 1px solid var(--border-default);
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.qr-tag {
  margin: 0;
  font-weight: 600;
}

.qr-code-label {
  color: var(--text-tertiary);
  letter-spacing: 2px;
  font-size: 11px;
}

.qr-code {
  font-weight: 700;
  font-feature-settings: 'tnum';
  letter-spacing: 1px;
}

.qr-actions {
  width: 100%;
}

.qr-actions :deep(.ant-btn-lg) {
  height: 44px;
  border-radius: 999px;
  font-weight: 600;
}

.qr-tip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
}
</style>