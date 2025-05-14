<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted,watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  name: [String, Number, Array],
  title: String,
  xAxisData: {
    type: Array,
    default: () => [],
  },
  seriesData: {
    type: Array,
    default: () => [],
  },
});

const chartRef = ref(null);
let myChart = null; 
// 初始化图表函数
const initChart = () => {
  myChart = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {


  const options = {
    title: {
      text: props.title,
      left: 'center',
    },
    xAxis: {
      name: '迭代次数',
      type: 'category',
      data: props.xAxisData,
    },
    yAxis: {
      name: props.name,
      type: 'value',
      min: 'dataMin', // 自动调整最小值
      max: 'dataMax', // 自动调整最大值
      axisLabel: {
      formatter: function(value) {
        return value.toFixed(2); // y轴标签保留两位小数
      }
    }
    },
    tooltip: {
      trigger: 'item', // 鼠标悬停在数据点上触发
      formatter: function (params) {
        return `${params.name}<br/>${params.seriesName}: ${params.value}`;
      },
    },
    series: [
      {
        data: props.seriesData,
        type: 'line',
      },
    ],
  };
  // 如果图表实例存在，则设置选项
  if (myChart) {
    myChart.setOption(options);
  }
};

// 监听props变化
watch(
  () => [ props.name, props.title, props.seriesData, props.xAxisData], // 监听title和seriesData的变化
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

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>