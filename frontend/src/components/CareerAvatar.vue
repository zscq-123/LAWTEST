<template>
  <div class="career-avatar" :style="avatarStyle">
    <img v-if="src" :src="src" :alt="name" class="avatar-img" />
    <span v-else class="avatar-text">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 职业ID（用于查插画） */
    id?: number
    /** 显式提供的图片地址（优先级高于 id） */
    src?: string
    /** 职业名（用于首字母与 alt） */
    name?: string
    /** 职业色 */
    color?: string
    /** 尺寸 */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /** 形状 */
    shape?: 'circle' | 'rounded'
  }>(),
  { size: 'md', shape: 'rounded' }
)

const initials = computed(() => {
  const n = props.name || ''
  return n.charAt(0).trim()
})

const avatarStyle = computed(() => {
  const sizeMap: Record<string, string> = {
    sm: '40px',
    md: '64px',
    lg: '96px',
    xl: '128px'
  }
  const radius = props.shape === 'circle' ? '50%' : 'var(--radius-lg)'
  return {
    width: `clamp(${sizeMap[props.size]}, 5vw, ${sizeMap[props.size]})`,
    height: `clamp(${sizeMap[props.size]}, 5vw, ${sizeMap[props.size]})`,
    borderRadius: radius,
    background: props.color
      ? `linear-gradient(140deg, ${props.color} 0%, ${props.color}cc 100%)`
      : 'var(--brand-primary)',
    boxShadow: props.color ? `0 0 28px ${props.color}66` : 'none'
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