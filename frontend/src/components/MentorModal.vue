<template>
  <a-modal
    :open="open"
    title="实务导师对接"
    :footer="null"
    width="720px"
    @cancel="emit('update:open', false)"
  >
    <template #title>
      <div class="modal-title">
        <team-outlined />
        <span>实务导师对接</span>
        <a-tag color="blue" bordered>{{ mentors.length }} 位</a-tag>
      </div>
    </template>

    <a-empty
      v-if="!mentors.length"
      description="导师名单待学院确认，敬请期待"
      :image-style="{ height: '60px' }"
    />
    <a-row v-else :gutter="[16, 16]">
      <a-col v-for="mentor in mentors" :key="mentor.id" :span="12">
        <a-card class="mentor-card" :bordered="false" size="small">
          <template #title>
            <div class="mentor-head">
              <a-avatar :size="48" :style="{ background: careerColor }">
                {{ mentor.name.charAt(0) }}
              </a-avatar>
              <div class="mentor-info">
                <div class="mentor-name">{{ mentor.name }}</div>
                <div class="mentor-title">{{ mentor.title }}</div>
              </div>
            </div>
          </template>
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
          <div v-else class="mentor-tip">可至「导师面对面」交流区现场咨询</div>
        </a-card>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import { TeamOutlined, PhoneOutlined } from '@ant-design/icons-vue'
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
.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.mentor-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.mentor-card:hover {
  border-color: var(--ant-color-primary, #1677ff);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.mentor-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mentor-info {
  flex: 1;
  min-width: 0;
}

.mentor-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.mentor-title {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
  margin-top: 2px;
}

.mentor-contact {
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
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