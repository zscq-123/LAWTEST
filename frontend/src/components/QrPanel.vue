<template>
  <div class="qr-panel glass-panel">
    <div class="qr-title">扫码带走你的职业画像</div>
    <div class="qr-glow">
      <span class="qr-ring" :style="{ borderColor: careerColor }" />
      <div class="qr-box">
        <img :src="report.qrImage" alt="报告二维码" class="qr-img" />
      </div>
    </div>
    <div class="qr-code">报告编号：{{ report.code }}</div>
    <div class="qr-actions">
      <a-button size="large" @click="copyLink">复制报告链接</a-button>
    </div>
    <div class="qr-tip">手机扫码即可查看、保存与收藏你的专属报告</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
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
  padding: 28px 36px;
  text-align: center;
  width: 420px;
}

.qr-title {
  font-size: 22px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.94);
  margin-bottom: 20px;
}

.qr-glow {
  position: relative;
  display: inline-block;
  border-radius: 12px;
}

.qr-ring {
  position: absolute;
  inset: -14px;
  border: 2px dashed;
  border-radius: 22px;
  animation: qrRing 9s linear infinite;
  pointer-events: none;
}

.qr-box {
  position: relative;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  display: inline-block;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.18);
}

.qr-img {
  width: 240px;
  height: 240px;
  display: block;
}

.qr-code {
  margin-top: 16px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 1px;
}

.qr-actions {
  margin-top: 18px;
}

.qr-tip {
  margin-top: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}
</style>
