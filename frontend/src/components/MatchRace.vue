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
  gap: clamp(14px, 1.8vw, 32px);
  height: clamp(250px, 40vh, 500px);
  align-items: stretch;
  justify-content: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.race-track {
  flex: 1;
  max-width: clamp(120px, 12vw, 240px);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatUp 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) both;
}

.race-label {
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.6vw, 12px);
  margin-bottom: clamp(8px, 1.4vh, 16px);
  font-size: clamp(14px, 1.35vw, 22px);
  color: rgba(255, 255, 255, 0.92);
}

.race-dot {
  width: clamp(10px, 0.8vw, 15px);
  height: clamp(10px, 0.8vw, 15px);
  border-radius: 50%;
}

.race-meter {
  flex: 1;
  width: clamp(36px, 3.4vw, 72px);
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
  font-size: clamp(16px, 1.6vw, 24px);
  font-weight: 700;
  color: #fff;
}

.race-pct {
  margin-top: clamp(6px, 1.2vh, 14px);
  font-size: clamp(14px, 1.3vw, 20px);
  color: rgba(255, 255, 255, 0.7);
}
</style>
