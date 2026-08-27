<template>
  <div ref="chartRef" class="radar-chart" :style="{ height: height + 'px' }" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  axes: string[]
  values: number[]
  color: string
  height?: number
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null
let observer: ResizeObserver | null = null

function render() {
  if (!chart) return
  chart.setOption({
    radar: {
      indicator: props.axes.map((name) => ({ name, max: 100 })),
      radius: '68%',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 15
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)']
        }
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.18)' }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.25)' }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: props.values,
            name: '能力画像',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: props.color + '88' },
                { offset: 1, color: props.color + '22' }
              ])
            },
            lineStyle: { color: props.color, width: 2 },
            itemStyle: { color: props.color }
          }
        ]
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  })
}

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  render()
  observer = new ResizeObserver(() => chart?.resize())
  observer.observe(chartRef.value)
})

watch(
  () => [props.values, props.color, props.axes],
  () => render(),
  { deep: true }
)

onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<style scoped>
.radar-chart {
  width: 100%;
}
</style>
