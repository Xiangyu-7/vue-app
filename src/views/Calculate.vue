<template>
  <el-container>
    <el-main>
      <!-- 使用 el-row 和 el-col 布局 -->
      <el-row :gutter="20">
        <!-- 左侧列：表单区域 -->
        <el-col :span="12">
          <!-- 选择优化目标 -->
          <el-card class="form-card">
            <h2>选择优化目标</h2>
            <el-checkbox-group v-model="form.targetFunctions">
              <el-checkbox value="LCOH" label="LCOH">LCOH</el-checkbox>
              <el-checkbox value="consumption" label="风光消纳率">风光消纳率</el-checkbox>
              <el-checkbox value="Hproduction" label="产氢量">产氢量</el-checkbox>
            </el-checkbox-group>
          </el-card>

          <!-- 选择优化算法 -->
          <el-card class="form-card">
            <h2>选择优化算法</h2>
            <el-radio-group v-model="form.optimizationAlgorithm">
              <el-radio value="enumeration">枚举法</el-radio>
              <el-radio value="geneticAlgorithm">遗传算法</el-radio>
            </el-radio-group>
          </el-card>

          <!-- 遗传算法参数设置 -->
          <el-card class="form-card" v-if="form.optimizationAlgorithm === 'geneticAlgorithm'">
            <h2>遗传算法参数设置</h2>
            <el-form :model="form" label-width="120px">
              <el-form-item v-for="item in GAparams" :key="item.label" :label="item.label">
                <el-input-number 
                v-model="item.num" 
                :min="0" 
                :step="item.key === 'crossoverRate' || item.key === 'mutationRate' ? 0.1 : 1" 
                class="GA-input"/>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 枚举法参数设置 -->
          <el-card class="form-card" v-if="form.optimizationAlgorithm === 'enumeration'">
            <h2>枚举法计算步长设置</h2>
            <el-form label-width="120px">
              <el-form-item v-for="item in enumerationParams" :key="item.label" :label="item.label">
                <el-input-number v-model="item.num" :min="0"  class="enumeration-input"/>
              </el-form-item>
            </el-form>
          </el-card>
          <!-- 开始计算按钮 -->
          <el-card class="form-card">
            <h2>开始计算</h2>
            <el-button type="primary" @click="startCalculation">开始计算</el-button>
            <el-button type="primary" @click="updateProgress">计算进度</el-button>
            <el-button type="primary" @click="stopCalculation">停止计算</el-button>
          </el-card>
        </el-col>

        <!-- 右侧列：计算进度和结果展示 -->
        <el-col :span="12">
          <!-- 计算进度 -->
          <el-card class="form-card">
            <h2>计算进度</h2>
            <el-progress :percentage="progress" status="success" />
          </el-card>

          <!-- 计算结果 -->
          <el-card class="form-card">
            <h2>计算结果</h2>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="优化目标">
                <el-tag v-for="target in form.targetFunctions" :key="target" style="margin-right: 5px;">
                  {{ target }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="优化算法">{{ form.optimizationAlgorithm }}</el-descriptions-item>
              <el-descriptions-item v-for = "item in GAparams"  :label="item.label" 
              v-if="form.optimizationAlgorithm === 'geneticAlgorithm'">
                {{ item.num }}
              </el-descriptions-item>
              <el-descriptions-item label="计算开始时间">
                {{ startTime ? formatDateTime(startTime) : '未开始' }}
              </el-descriptions-item>
              <el-descriptions-item label="计算结束时间">
                {{ endTime ? formatDateTime(endTime) : '未完成' }}
              </el-descriptions-item>
              <el-descriptions-item label="计算结果">{{ result || '未完成' }}</el-descriptions-item>
            </el-descriptions>

          </el-card>
            <div>   
              <line-chart :name ="form.targetFunctions" title="迭代曲线" :x-axis-data="xAxisData" :series-data="LCOHData" />
            </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, reactive ,watch} from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import LineChart from '@/components/LineChart.vue';

// 表单数据
const form = ref({
  targetFunctions: [], // 优化目标（多选）
  optimizationAlgorithm: 'enumeration', // 优化算法
});

// 计算结果
const result = ref(null);

// 计算进度
const progress = ref(0);
const isCalculating = ref(false);

// 计算开始时间和结束时间
const startTime = ref(null);
const endTime = ref(null);

// 格式化日期时间
const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

const startCalculation = async () => {

  if (form.value.targetFunctions.length === 0) {
    alert('请选择至少一个优化目标！');
    return;
  }
    // 记录计算开始时间
  startTime.value = new Date();
  isCalculating.value = true;
  progress.value = 0;
  //const response = await axios.get('http://localhost:8080/enumerate');

  if (form.value.optimizationAlgorithm === 'geneticAlgorithm' ){
    const params = {
      targetFunctions: form.value.targetFunctions,
    }
    console.log(params);
    const response = await axios.post('http://localhost:8080/handle_ga_request',params)
    console.log(response.data);
  } else {
    const response = await axios.get('http://localhost:8080/enumerate');
    console.log(response.data);
  }
}
const updateProgress = async () => {

  try {
    const response = await axios.get('http://localhost:8080/progress');
    progress.value = response.data.progress;
    if (progress.value >= 100) {
      isCalculating.value = false;
      // 记录计算结束时间
      endTime.value = new Date();
      result.value = `计算完成,请到结果分析页面查看计算结果。`;
    }else{
      // 每秒更新一次进度
      setTimeout(updateProgress, 1000);
    }

  } catch (error) {
      console.error("获取进度失败:", error);
  }
};
const stopCalculation = async () => {
  try {
    const response = await axios.get('http://localhost:8080/stop_enumerate');
    console.log(response.data);
  }
  catch (error) {
    console.error("停止计算失败:", error);
  }
};
// 用于 v-for 循环的数据
const enumerationParams = ref([
  { key: 'step1',label: '风电', num: 5 },
  { key: 'step2',label: '光伏', num:5 },
  { key: 'step3',label: '储能', num: 5 },
  { key: 'step4',label: '电解槽', num:5  },
  { key: 'step5',label: '储氢罐', num:1  }
]);

const GAparams = ref([
  {key:'iterationCount', label: '迭代次数', num: 50}, // 迭代次数
  {key:'populationSize', label: '种群大小', num: 20}, // 种群大小
  {key:'crossoverRate', label: '交叉概率', num: 0.8}, // 交叉概率
  {key:'mutationRate', label: '变异概率', num: 0.1}, // 变异概率
  ]);
const steps = ref({});
const GA = ref(null);
const extractSteps = () => {
  const newSteps = {};
  enumerationParams.value.forEach(item => {
    newSteps[item.key] = item.num;
  });
  return newSteps;
};
const extractGA = () => {
  const newGA = {};
  GAparams.value.forEach(item => {
    newGA[item.key] = item.num;
  });
  return newGA;
};
watch(
  () => enumerationParams.value, // 监听整个数组
  () => {
    steps.value = extractSteps();
    GA.value = extractGA();
    setsteps();
  },
  { deep: true } // 深度监听数组的变化
);
const setsteps = async() => {
  try {
    const response = await axios.post('http://localhost:8080/setsteps', { steps: steps.value });
    console.log(response.data);
  } catch (error) {
    console.error("设置参数失败:", error);
    alert("设置参数失败，请检查输入参数是否正确！");
  }
};
const setGA = async() => {
  try {
    const response = await axios.post('http://localhost:8080/setGA', { GA: GA.value });
    console.log(response.data);
  } catch (error) {
    console.error("设置参数失败:", error);
    alert("设置参数失败，请检查输入参数是否正确！");
  }
};
watch(
  () => GAparams.value, // 监听整个数组
  () => {
    steps.value = extractGA();
    GA.value = extractGA();
    setGA();
  },
  { deep: true } // 深度监听数组的变化
);

</script>

<style scoped>

.el-header h1 {
  margin: 0;
  font-size: 24px;
}

.el-header p {
  margin: 10px 0 0;
  font-size: 14px;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}

.form-card {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-top: 20px;
}

.el-tag {
  margin-right: 5px;
}

</style>
