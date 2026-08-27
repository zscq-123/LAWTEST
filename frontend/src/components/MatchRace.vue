<template>
  <div class="race">
    <div
      v-for="(career, index) in careers"
      :key="career.id"
      class="race-track"
      :style="{ animationDelay: `${index * 0.12}s` }"
    >
      <div class="race-label">
        <span class="race-dot" :style="{ background: career.colorCode }" />
        <span class="race-name">{{ career.name }}</span>
      </div>
      <div class="race-meter">
        <div
          class="race-fill"
          :style="{
            height: pct(career.id),
            background: `linear-gradient(180deg, ${career.colorCode}, ${career.colorCode}55)`,
            boxShadow: `0 0 18px ${career.colorCode}88`
          }"
        >
          <span class="race-value">{{ scoreOf(career.id) }}</span>
        </div>
      </div>
      <div class="race-pct">{{ pct(career.id) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Career } from '@/types'

const props = defineProps<{
  careers: Career[]
  scores: Record<string, number>
}>()

function scoreOf(id: number): number {
  return props.scores[String(id)] ?? 0
}

function pct(id: number): string {
  return Math.round((scoreOf(id) / 20) * 100) + '%'
}
</script>

<style scoped>
.race {
  display: flex;
  gap: 28px;
  height: 460px;
  align-items: stretch;
  justify-content: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.race-track {
  flex: 1;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.race-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.92);
}

.race-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.race-meter {
  flex: 1;
  width: 64px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.race-fill {
  width: 100%;
  border-radius: 32px;
  transition: height 2.8s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
}

.race-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.race-pct {
  margin-top: 12px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
