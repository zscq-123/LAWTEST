<template>
  <ScreenFrame>
    <a-config-provider :theme="careerTheme">
      <div class="screen-page fitness-page">
        <div class="fitness-head">
          <div>
            <h1 class="screen-title" style="font-size: 34px">
              {{ report?.career?.name || '' }} · 体能赋能方案
            </h1>
            <p class="screen-subtitle" style="font-size: 16px">
              身体是职业长跑的本钱，大学四年一步一步来
            </p>
          </div>
          <a-button size="large" @click="router.push('/profile')">返回画像</a-button>
        </div>

        <a-spin v-if="!report" class="fitness-loading" size="large" />

        <template v-else>
          <div class="fitness-body">
            <div class="panel glass-panel">
              <div class="panel-title">
                <check-circle-outlined :style="{ color: careerColor }" />
                身体素质达标要求
              </div>
              <a-list :data-source="report.fitnessRequirements" :split="false">
                <template #renderItem="{ item }">
                  <a-list-item class="req-item">
                    <span class="req-badge" :style="{ background: careerColor }">
                      {{ item.seq }}
                    </span>
                    {{ item.content }}
                  </a-list-item>
                </template>
              </a-list>
            </div>

            <div class="panel glass-panel">
              <div class="panel-title">
                <rise-outlined :style="{ color: careerColor }" />
                大学四年阶梯式锻炼计划
              </div>
              <a-timeline class="plan-timeline">
                <a-timeline-item
                  v-for="plan in report.fitnessPlans"
                  :key="plan.id"
                  :color="careerColor"
                >
                  <div class="plan-stage">{{ plan.yearStage }}</div>
                  <div class="plan-content">{{ plan.content }}</div>
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>

          <div class="fitness-actions">
            <a-button size="large" type="primary" class="btn-primary-glow" @click="qrOpen = true">
              <template #icon><qrcode-outlined /></template>
              扫码带走
            </a-button>
            <a-button size="large" @click="mentorOpen = true">
              <template #icon><team-outlined /></template>
              导师对接
            </a-button>
          </div>

          <div class="fitness-disclaimer">
            {{ disclaimer }} · {{ report.match.disclaimer }}
          </div>
        </template>

        <a-modal v-model:open="qrOpen" :footer="null" width="480px" centered>
          <QrPanel :report="report!" />
        </a-modal>

        <MentorModal
          :open="mentorOpen"
          :mentors="report?.mentors || []"
          :career-color="careerColor"
          @update:open="(v) => (mentorOpen = v)"
        />
      </div>
    </a-config-provider>
  </ScreenFrame>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckCircleOutlined,
  QrcodeOutlined,
  RiseOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import ScreenFrame from '@/components/ScreenFrame.vue'
import QrPanel from '@/components/QrPanel.vue'
import MentorModal from '@/components/MentorModal.vue'
import { useTestStore } from '@/stores/test'

const store = useTestStore()
const router = useRouter()
const qrOpen = ref(false)
const mentorOpen = ref(false)

const report = computed(() => store.report)
const career = computed(() => store.report?.career || null)
const careerColor = computed(() => career.value?.colorCode || '#1677FF')
const disclaimer = '本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。'

const careerTheme = computed(() => ({
  token: {
    colorPrimary: careerColor.value,
    borderRadius: 8
  }
}))
</script>

<style scoped>
.fitness-page {
  padding-top: 36px;
}

.fitness-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
}

.fitness-loading {
  margin: auto;
}

.fitness-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 28px;
  margin-top: 22px;
  min-height: 0;
  overflow-y: auto;
}

.panel {
  padding: 26px 30px;
}

.panel-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  gap: 10px;
}

.req-item {
  padding: 10px 0 !important;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.req-badge {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
}

.plan-timeline {
  padding-top: 6px;
}

.plan-stage {
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}

.plan-content {
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
}

.fitness-actions {
  margin-top: 18px;
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-shrink: 0;
}

.fitness-actions :deep(.ant-btn-lg) {
  height: 52px;
  padding: 0 36px;
  font-size: 17px;
  border-radius: 26px;
}

.fitness-disclaimer {
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}
</style>
