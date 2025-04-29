<template>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-card>
              <h3>最优方案</h3>
              <el-table :data="schemes" @row-click="handleRowClick" style="width: 100%; height: 300px;">
                <el-table-column prop="scheme" label="方案" width="180"></el-table-column>
                <el-table-column prop="windPower" label="风电(MW)" width="180"></el-table-column>
                <el-table-column prop="solarPower" label="光伏(MW)" width="180"></el-table-column>
                <el-table-column prop="storage" label="储能(MW·h)" width="180"></el-table-column>
                <el-table-column prop="electrolyzer" label="电解槽(MW)" width="180"></el-table-column>
                <el-table-column prop="hydrogenTanks" label="储氢罐(个)" width="180"></el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card>
              <h3>详细结果</h3>
              <el-table :data="selectedSchemeDetails" style="width: 100%; height: 300px;">
                <el-table-column prop="name"></el-table-column>
                <el-table-column prop="value" ></el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
  
        <el-row :gutter="20" style="margin-top: 20px;">
         
          <el-col :span="24">
            <el-card>
              <h1>典型日分时出力情况</h1>
              <StackedBarLineChart :chartData="chartData" v-if="chartData && typeof chartData === 'object'"/>
            </el-card>
            <div>   
              <line-chart name ="LCOH(元/kg)" title="各方案LCOH对比" :x-axis-data="xAxisData" :series-data="LCOHData" />
            </div>
            <div>
              <line-chart name ="消纳率(%)" title="各方案风光消纳率对比" :x-axis-data="xAxisData" :series-data="consumptiondata" />
            </div>
            <div>
              <line-chart name ="产氢量(万吨)" title="各方案产氢量对比" :x-axis-data="xAxisData" :series-data="Hproductiondata" />
            </div>
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import * as echarts from 'echarts';
  import axios from 'axios';
  import { de } from 'element-plus/es/locales.mjs';
  import LineChart from '@/components/LineChart.vue';
  import StackedBarLineChart from '@/components/StackedBarLineChart.vue';

  // 方案数据
  const schemes = ref([]);
  const SchemeDetails = [];
  const SchemeDetails1 = ref([]);
  const chart = ref(null);
  const chartData = ref(null);
  // 选中的方案详细结果
  const selectedSchemeDetails = ref([]);
  const xAxisData = ref([]);
  const LCOHData = ref([]);
  const consumptiondata = ref([]);
  const Hproductiondata = ref([]);
  // ECharts 实例
  // let chart = null; // 改为普通变量
  const chartDom = ref(null); // chartDom 仍然是 ref
  
  // 处理行点击事件
  const handleRowClick = async (row) => {
    const schemedata = [row.windPower, row.solarPower, row.storage, row.electrolyzer, row.hydrogenTanks]
    SchemeDetails1.value = getSchemeDetails(row.scheme);
    selectedSchemeDetails.value = getSchemeDetails(row.scheme);
    // renderChart(row.scheme);
      try {
      const response = await axios.post('http://localhost:8080/chart_data',schemedata); // 假设后端接口返回数据
      chartData.value = response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  // 模拟获取详细结果数据
  const getSchemeDetails = (scheme) => {
    return SchemeDetails.value[scheme] || null
  };
  
  // 渲染图表
  const renderChart = (scheme) => {
    if (chart) {
      chart.dispose(); // 销毁旧的 ECharts 实例
    }
    // 确保 chartDom.value 是有效的 DOM 元素
    if (!chartDom.value) {
      console.error('ECharts 容器未找到');
      return;
    }
    chart = echarts.init(chartDom.value); // 初始化 ECharts 实例
    const option = {
      xAxis: {
        type: 'category',
        data: selectedSchemeDetails.value.map(item => item.time),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: selectedSchemeDetails.value.map(item => item.power),
          type: 'bar',
        },
      ],
    };
    chart.setOption(option);
  };
  
// 从后端获取数据
const fetchSchemes = async () => {

  try {
    const response = await axios.get('http://localhost:8080/schemes')
    const response1 = await axios.get('http://localhost:8080/linechart')
    const result = await response.data.schemes
    const details = await response.data.details
    schemes.value = result.data || result
    SchemeDetails.value = details.data || details
    xAxisData.value = response1.data.schemes
    LCOHData.value = response1.data.LCOH
    consumptiondata.value = response1.data.consumption
    Hproductiondata.value = response1.data.Hproduction
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}



onMounted(() => {
  fetchSchemes()
})


</script>
  
<style scoped>
  
  .el-card {
    margin-bottom: 20px;
  }
  
  h3 {
    margin-bottom: 20px;
  }
</style>