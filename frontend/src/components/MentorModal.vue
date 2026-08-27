<template>
  <a-modal
    :open="open"
    title="实务导师对接"
    :footer="null"
    width="720px"
    @cancel="emit('update:open', false)"
  >
    <a-empty v-if="!mentors.length" description="导师名单待学院确认，敬请期待" />
    <a-row v-else :gutter="[16, 16]">
      <a-col v-for="mentor in mentors" :key="mentor.id" :span="12">
        <div class="mentor-card" :style="{ borderTopColor: careerColor }">
          <div class="mentor-head">
            <a-avatar :size="52" :style="{ background: careerColor }">
              {{ mentor.name.charAt(0) }}
            </a-avatar>
            <div class="mentor-info">
              <div class="mentor-name">{{ mentor.name }}</div>
              <div class="mentor-title">{{ mentor.title }}</div>
            </div>
          </div>
          <div v-if="mentor.contact" class="mentor-contact">
            <phone-outlined /> {{ mentor.contact }}
          </div>
          <a-button
            v-if="mentor.bookingUrl"
            type="primary"
            block
            :href="mentor.bookingUrl"
            target="_blank"
            class="mentor-btn"
            :style="{ background: careerColor, borderColor: careerColor }"
          >
            预约交流
          </a-button>
          <div v-else class="mentor-tip">可到“导师面对面”交流区现场咨询</div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import { PhoneOutlined } from '@ant-design/icons-vue'
import type { Mentor } from '@/types'

defineProps<{
  open: boolean
  mentors: Mentor[]
  careerColor: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<style scoped>
.mentor-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-top: 3px solid #1677ff;
  border-radius: 8px;
  padding: 16px;
}

.mentor-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mentor-name {
  font-size: 16px;
  font-weight: 600;
}

.mentor-title {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
  margin-top: 2px;
}

.mentor-contact {
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.mentor-btn {
  margin-top: 12px;
}

.mentor-tip {
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}
</style>
