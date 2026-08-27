<template>
  <div
    class="career-avatar"
    :class="['avatar-' + shape, ' size-' + size]"
    :style="containerStyle"
  >
    <img
      v-if="iconSrc"
      :src="iconSrc"
      :alt="name"
      class="avatar-img"
      loading="lazy"
    />
    <span v-else class="avatar-text">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 职业ID（1=律师 2=法官 3=检察官 4=企业法务 5=AI伦理） */
    id?: number
    /** 显式提供的图片地址（优先级最高） */
    src?: string
    /** 职业名（用于首字母与 alt） */
    name?: string
    /** 职业色（作为图标背景或描边） */
    color?: string
    /** 尺寸 */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    /** 形状 */
    shape?: 'circle' | 'rounded' | 'square'
    /** 变体：solid 彩色背景 + 图标 / plain 仅图标透明背景 */
    variant?: 'solid' | 'plain'
  }>(),
  { size: 'md', shape: 'rounded', variant: 'solid' }
)

/** 职业 ID → MiniMax 生成的职业图标路径（位于 /icons/） */
const ICON_MAP: Record<number, string> = {
  1: '/icons/lawyer.png',
  2: '/icons/judge.png',
  3: '/icons/prosecutor.png',
  4: '/icons/legal.png',
  5: '/icons/ai-ethics.png'
}

const iconSrc = computed(() => {
  if (props.src) return props.src
  if (props.id != null && ICON_MAP[props.id]) return ICON_MAP[props.id]
  return ''
})

const initials = computed(() => {
  const n = props.name || ''
  return n.charAt(0).trim()
})

const sizeMap: Record<string, string> = {
  xs: '28px',
  sm: '40px',
  md: '56px',
  lg: '80px',
  xl: '112px'
}

const radius = computed(() => {
  if (props.shape === 'circle') return '50%'
  if (props.shape === 'square') return 'var(--radius-md)'
  return 'var(--radius-lg)'
})

const containerStyle = computed(() => {
  const baseSize = sizeMap[props.size]
  const isPlain = props.variant === 'plain'
  return {
    width: `clamp(${baseSize}, 4.8vw, ${baseSize})`,
    height: `clamp(${baseSize}, 4.8vw, ${baseSize})`,
    borderRadius: radius.value,
    background: isPlain
      ? 'transparent'
      : props.color
      ? `linear-gradient(140deg, ${props.color} 0%, ${props.color}cc 100%)`
      : 'var(--brand-primary)',
    boxShadow: !isPlain && props.color ? `0 0 24px ${props.color}66` : 'none'
  }
})
</script>

<style scoped>
.career-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  flex-shrink: 0;
  overflow: hidden;
  letter-spacing: 1px;
  transition: transform 0.3s var(--ease-out);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  font-size: 1.5em;
  line-height: 1;
}
</style>