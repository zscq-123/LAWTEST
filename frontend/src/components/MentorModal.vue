<template>
  <a-modal
    :open="open"
    title="实务导师对接"
    :footer="null"
    width="880px"
    @cancel="emit('update:open', false)"
  >
    <template #title>
      <div class="modal-title">
        <team-outlined />
        <span>实务导师对接</span>
        <a-tag :color="careerColor" bordered :style="{ color: textOnColor(careerColor) }">{{ mentors.length }} 位</a-tag>
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
              <a-avatar :size="48" :style="{ background: accent }">
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
          <a-collapse
            v-if="mentor.bio"
            class="mentor-bio"
            ghost
            :bordered="false"
            expand-icon-position="end"
          >
            <a-collapse-panel key="bio">
              <template #header>
                <span class="bio-label">个人简介</span>
              </template>
              <p class="bio-text">{{ mentor.bio }}</p>
            </a-collapse-panel>
          </a-collapse>
          <div v-if="mentor.message" class="mentor-message">
            <div class="message-label">导师寄语</div>
            <p class="message-text">{{ mentor.message }}</p>
          </div>
          <a-button
            v-if="mentor.bookingUrl"
            type="primary"
            block
            :href="mentor.bookingUrl"
            target="_blank"
            class="mentor-btn"
            :style="{ background: accent, borderColor: accent }"
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
import { computed } from 'vue'
import { TeamOutlined, PhoneOutlined } from '@ant-design/icons-vue'
import { isNearWhite, textOnColor } from '@/utils/color'
import type { Mentor } from '@/types'

const props = defineProps<{
  open: boolean
  mentors: Mentor[]
  careerColor: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

/** 职业色接近纯白（如律师皓月白）时用深蓝灰作为头像/按钮底色，保证白字可读 */
const accent = computed(() => (isNearWhite(props.careerColor) ? '#5C7693' : props.careerColor))
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
  background: rgba(228, 238, 247, 0.40);
  border: 1px solid rgba(124, 154, 184, 0.16);
  border-radius: 10px;
  transition: all 0.25s ease;
}

.mentor-card:hover {
  border-color: var(--ant-color-primary, #7c9ab8);
  box-shadow: 0 6px 20px rgba(124, 154, 184, 0.16);
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
  color: rgba(52, 64, 84, 0.55);
  font-size: 13px;
  margin-top: 2px;
}

.mentor-contact {
  margin-top: 12px;
  color: rgba(52, 64, 84, 0.68);
  font-size: 13px;
}

.mentor-bio {
  margin-top: 8px;
  font-size: 13px;
}

.bio-label {
  color: rgba(52, 64, 84, 0.72);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 1px;
}

.bio-text {
  margin: 0;
  color: rgba(52, 64, 84, 0.72);
  line-height: 1.7;
  white-space: pre-line;
}

.mentor-message {
  margin-top: 10px;
  padding: 8px 12px;
  border-left: 3px solid v-bind(accent);
  background: rgba(124, 154, 184, 0.10);
  border-radius: 6px;
}

.message-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(52, 64, 84, 0.55);
}

.message-text {
  margin: 4px 0 0;
  color: rgba(52, 64, 84, 0.78);
  font-size: 13px;
  line-height: 1.7;
}

.mentor-btn {
  margin-top: 12px;
}

.mentor-tip {
  margin-top: 12px;
  color: rgba(52, 64, 84, 0.48);
  font-size: 13px;
}
</style>
