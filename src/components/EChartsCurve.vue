<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
let myChart = null; // 保存图表实例

const props = defineProps({
  title: String,
  xAxisData: Array,
  seriesData: Array
});

// 初始化图表函数
const initChart = () => {
  myChart = echarts.init(chartRef.value);
  updateChart();
};

// 更新图表函数
const updateChart = () => {
  const option = {
    title: {
      text: props.title,
      left: 'center',
    },
    tooltip: false,
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 8760 }, (_, i) => i + 1),
    },
    yAxis: {
      type: 'value',
      name: 'MW',
      min: 0,
      max: 1,
      interval: 0.1,
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '发电量',
        type: 'line',
        data: props.seriesData,
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        },
        smooth: true,
        areaStyle: {}
      }
    ]
  };
  
  // 如果图表实例存在，则设置选项
  if (myChart) {
    myChart.setOption(option);
  }
};

// 监听props变化
watch(
  () => [props.title, props.seriesData], // 监听title和seriesData的变化
  () => {
    updateChart();
  },
  { deep: true } // 深度监听，特别是对于数组变化
);

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});

</script>