<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  flatRate: Number,
  valleyRate: Number,
  peakRate: Number,
  hours: Array,
});

const chartRef = ref(null);
let myChart = null; // 用于存储图表实例

// 初始化图表
const initChart = () => {
  if (myChart) {
    myChart.dispose(); // 如果已经存在图表实例，先销毁
  }
  myChart = echarts.init(chartRef.value); // 初始化图表实例

  const option = {
    title: {
      text: '分时电价柱状图',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    },
    yAxis: {
      type: 'value',
      name: '电价 (元)',
    },
    series: [
      {
        name: '电价',
        type: 'bar',
        data: props.hours.map((type) => {
          switch (type) {
            case 'flat':
              return props.flatRate;
            case 'valley':
              return props.valleyRate;
            case 'peak':
              return props.peakRate;
            default:
              return 0;
          }
        }),
        itemStyle: {
          color: function (params) {
            switch (props.hours[params.dataIndex]) {
              case 'flat':
                return '#7cb5ec';
              case 'valley':
                return '#90ed7d';
              case 'peak':
                return '#f7a35c';
              default:
                return '#ccc';
            }
          },
        },
      },
    ],
  };

  myChart.setOption(option); // 设置图表配置
};

// 在组件挂载时初始化图表
onMounted(() => {
  initChart();
});

// 监听 props 变化，重新渲染图表
watch(
  () => [props.flatRate, props.valleyRate, props.peakRate, props.hours],
  () => {
    initChart();
  },
  { deep: true }
);

// 在组件卸载时销毁图表实例
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>