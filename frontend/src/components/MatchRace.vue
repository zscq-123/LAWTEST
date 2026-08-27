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
          :class="{ 'race-win': isTop(career.id) }"
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

/** 是否为当前最高分赛道（点亮领跑光效） */
function isTop(id: number): boolean {
  const max = Math.max(...props.careers.map((c) => scoreOf(c.id)))
  return max > 0 && scoreOf(id) === max
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
  flex: 0 1 auto;
  width: clamp(140px, 12vw, 220px);
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
  font-weight: var(--fw-semibold);
  letter-spacing: 1px;
}

.race-dot {
  width: clamp(10px, 0.8vw, 15px);
  height: clamp(10px, 0.8vw, 15px);
  border-radius: 50%;
  animation: energyPulse 1.6s ease-in-out infinite;
}

.race-meter {
  flex: 1;
  width: clamp(56px, 5vw, 96px);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-default);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.race-fill {
  width: 100%;
  border-radius: 32px;
  transition: height 2.8s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
}

/* 领跑赛道：强光 + 顶部光晕 */
.race-fill.race-win {
  animation: energyPulse 1.2s ease-in-out infinite;
  box-shadow:
    0 0 24px currentColor,
    inset 0 0 16px rgba(255, 255, 255, 0.25) !important;
  position: relative;
}

.race-fill.race-win::before {
  content: '领跑';
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #faad14, #ff7a45);
  color: #1a1a1a;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 2px;
  box-shadow: 0 4px 16px rgba(250, 173, 20, 0.5);
  z-index: 2;
}

.race-value {
  font-size: clamp(16px, 1.6vw, 24px);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

.race-pct {
  margin-top: clamp(6px, 1.2vh, 14px);
  font-size: clamp(14px, 1.3vw, 20px);
  color: rgba(255, 255, 255, 0.78);
  font-weight: 700;
  font-feature-settings: 'tnum';
}
</style>
