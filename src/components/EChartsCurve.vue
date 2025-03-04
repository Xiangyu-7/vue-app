<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
const props = defineProps({
  title: String, // 接收父组件传递的标题
  xAxisData: Array,
  seriesData: Array
});
const initChart = () => {
const myChart = echarts.init(chartRef.value);
const option = {
  title: {
    text: props.title,
    left: 'center',
  },
  tooltip: false,
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({ length: 8760 }, (_, i) => i + 1), // 8760 hours
  },
  yAxis: {
    type: 'value',
    name: 'MW',
    min: 0,
    max: 1, // 根据实际数据调整
    interval: 0.1,
    axisLabel: {
      formatter: '{value}'
    }
  },
  series: [
    {
      name: '发电量',
      type: 'line',
      data: props.seriesData, // 使用父组件传递的seriesData
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
myChart.setOption(option);
};

onMounted(() => {
initChart();
});


</script>