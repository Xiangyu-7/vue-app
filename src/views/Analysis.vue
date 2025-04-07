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
              <h3>典型日的分时出力情况</h3>
              <div ref="chart" style="width: 100%; height: 400px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
import axios from 'axios';
import { de } from 'element-plus/es/locales.mjs';
  
  // 方案数据
  const schemes = ref([]);
  const SchemeDetails = [];
  const SchemeDetails1 = ref([]);
  // 选中的方案详细结果
  const selectedSchemeDetails = ref([]);
  
  // ECharts 实例
  let chart = null; // 改为普通变量
  const chartDom = ref(null); // chartDom 仍然是 ref
  
  // 处理行点击事件
  const handleRowClick = (row) => {
    SchemeDetails1.value = getSchemeDetails(row.scheme);
    selectedSchemeDetails.value = getSchemeDetails(row.scheme);
    // renderChart(row.scheme);
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
    const result = await response.data.schemes
    const details = await response.data.details
    schemes.value = result.data || result
    SchemeDetails.value = details.data || details
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// 页面挂载时获取数据
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