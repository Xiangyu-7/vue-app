<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
});

const chartRef = ref(null);

const initChart = () => {
  if (!props.chartData) {
    console.warn('chartData is not available yet');
    return;
  }

  const myChart = echarts.init(chartRef.value);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: props.chartData.legend || [],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        name: 'hour',
        data: props.chartData.xAxisData || [],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'MW',
      },
    ],
    series: props.chartData.series || [],
  };

  myChart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(() => props.chartData, () => {
  initChart();
}, { deep: true });
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>