<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  flatRate: Number,
  valleyRate: Number,
  peakRate: Number,
  hours: Array,
});

const chartRef = ref(null);

const initChart = () => {
  const myChart = echarts.init(chartRef.value);
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
  myChart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(
  () => [props.flatRate, props.valleyRate, props.peakRate, props.hours],
  () => {
    initChart();
  },
  { deep: true }
);
</script>