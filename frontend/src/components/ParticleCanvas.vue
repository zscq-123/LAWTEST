<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  color: string
  active: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let particles: Particle[] = []
let running = false
let startedAt = 0

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: number
  color: string
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const v = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function spawn() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const cx = rect.width / 2
  const cy = rect.height / 2
  const [r, g, b] = hexToRgb(props.color)
  for (let i = 0; i < 140; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 9
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 1.2 + Math.random() * 3.2,
      life: 0,
      maxLife: 60 + Math.random() * 50,
      hue: 0,
      color: `rgba(${r}, ${g}, ${b}, 1)`
    })
  }
}

function tick(now: number) {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const dpr = window.devicePixelRatio || 1
  const w = canvas.width / dpr
  const h = canvas.height / dpr

  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2

  // 中心光爆
  const elapsed = now - startedAt
  const burst = Math.max(0, 1 - elapsed / 900)
  if (burst > 0) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180 * burst)
    grad.addColorStop(0, props.color + 'cc')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)
  }

  particles = particles.filter((p) => p.life < p.maxLife)
  for (const p of particles) {
    p.life++
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.06
    p.vx *= 0.985
    const alpha = 1 - p.life / p.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  if (running && particles.length > 0) {
    raf = requestAnimationFrame(tick)
  } else {
    running = false
  }
}

function start() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  particles = []
  spawn()
  startedAt = performance.now()
  running = true
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  if (props.active) start()
})

watch(
  () => props.active,
  (v) => {
    if (v) start()
  }
)

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
