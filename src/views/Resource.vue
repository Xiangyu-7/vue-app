<template>
    <el-container class="resource-config-container">
      <el-main class="main">
        <el-form label-width="120px">
          <el-form-item label="选择省份"  style="width: 500px;">
            <el-select v-model="selectedProvince" placeholder="请选择省份">
              <el-option
                v-for="province in provinces"
                :key="province.value"
                :label="province.label"
                :value="province.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="fetchData">获取数据</el-button>
          </el-form-item>
        </el-form>
        
            <el-row :gutter="20">
            <!-- 左侧内容 -->
            <el-col :span="14">
                <el-card class="province-info">
                <h3>{{ selectedProvince ? selectedProvince : '未选择省份' }}</h3>
                <p>地理位置：{{ provinceDetails.location }}</p>
                <p>资源概况：{{ provinceDetails.description }}</p>
                </el-card>
    
                <el-card class="resource-table" style="height: 500px;">
                <h3>资源统计数据</h3>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="name" label="资源类型" />
                    <el-table-column prop="value" label="数值" />
                </el-table>
                </el-card>
            </el-col>
    
            <!-- 右侧曲线图 -->
            <el-col :span="10">
                <EChartsCurve
                title="风电出力标幺值"
                :xAxisData="hours"
                :seriesData="windData"
                />
                <EChartsCurve
                title="光伏出力标幺值"
                :xAxisData="hours"
                :seriesData="solarData"
                />
            </el-col>
            </el-row>

        
        <h3>每小时电价类型设置</h3>
        <el-row :gutter="20">
          <el-col v-for="(hour, index) in hours" :key="index" :span="6">
            <div class="hour-setting">
              <span>{{ index }}:00</span>
              <el-select v-model="hours[index]" placeholder="请选择">
                <el-option label="平段" value="flat" />
                <el-option label="谷段" value="valley" />
                <el-option label="高峰" value="peak" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form label-width="100px" class="price-setting">
          <el-form-item label="平段电价:">
            <el-input-number v-model="flatRate" :step="0.01" />
          </el-form-item>
          <el-form-item label="谷段电价:">
            <el-input-number v-model="valleyRate" :step="0.01" />
          </el-form-item>
          <el-form-item label="高峰电价:">
            <el-input-number v-model="peakRate" :step="0.01" />
          </el-form-item>
        </el-form>
          </el-col>
          <el-col :span="20">
            <TimeOfUseChart
          :flatRate="flatRate"
          :valleyRate="valleyRate"
          :peakRate="peakRate"
          :hours="hours"
          style="margin-top: 30px;"
        />
          </el-col>
        </el-row>
     
       
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import EChartsCurve from '@/components/EChartsCurve.vue';
  import TimeOfUseChart from '@/components/TimeOfUseChart.vue';
  const provinces = [
    { label: '北京', value: 'BJ' },
    { label: '上海', value: 'SH' },
    { label: '广东', value: 'GD' },
    // 添加更多省份
  ];
  const selectedProvince = ref('');
  const windData = ref([]);
  const solarData = ref([]);
  const priceData = ref([]);
  // const hours = Array.from({ length: 24 }, (_, i) => `${i}小时`);
  const provinceDetails = ref({
    location: '',
    description: '',
    images: [],
  });
  const tableData = ref([]);
  
  const fetchData = () => {
    // 模拟数据获取
    windData.value = Array.from({ length: 24 }, () => Math.random() * 10);
    solarData.value = Array.from({ length: 24 }, () => Math.random() * 10);
    priceData.value = Array.from({ length: 24 }, () => Math.random() * 5);
  
    // 模拟省份详细信息
    provinceDetails.value = {
      location: '',
      description: '',
    };
  
    // 模拟表格数据
    tableData.value = [
      { name: '年平均温度', value: '' },
      { name: '年平均风速', value: '' },
      { name: '水平面年总辐照度', value: '' },
      { name: '年均光照时长', value: '' },
    ];
  };
  const flatRate = ref(0.5); // 默认平段电价
const valleyRate = ref(0.3); // 默认谷段电价
const peakRate = ref(0.7); // 默认高峰电价

const hours = ref(
  Array.from({ length: 24 }, () => 'flat') // 默认每小时都是平段
  );
  </script>
  
<style scoped>
  .resource-config-container {
    height: 100%;
  }

  .main {
    padding: 20px;
  }
  .province-info,
  .province-images,
  .resource-table {
    margin-top: 20px;
  }
  .province-image {
    width: 100%;
    height: 150px;
    border-radius: 8px;
  }
  .app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.el-header {
  background-color: #f0f2f5;
  padding: 10px;
}

.el-main {
  flex: 1;
  padding: 20px;
}

.hour-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-setting {
  margin-top: 100px;
  margin-left: 150px;

}
</style>