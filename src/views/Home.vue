<template>
  <el-row class="home" :gutter="20">
    <el-col :span="10 " style="margin-top: 20px;">
      <el-card  style="height: 1000px ;">
        <h2 class="system-title">风光制氢系统</h2>
        <el-collapse v-model="activeNames" class="collapse-panel">
          <el-collapse-item title="组件库" name="1" >
            <div class="image-container">
              <div
                class="image-with-label"
                v-for="item in images"
                :key="item.name"
              >
                <el-image
                  class="image-item"
                  :src="getImageUrl(item.name)"
                  fit="cover"
                  :alt="item.label"
                  @click="openSettings(item)" 
                ></el-image>
                <p class="image-label">{{ item.label }}</p>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="14" style="margin-top: 20px;">
      <el-card shadow="hover" class="user-table">
        <h2 class="system-title">模型参数</h2>
        <el-card shadow="hover" class="user-table">
            <div class="table-container">
                <h3>电化学储能 </h3>
            <el-form :inline="true" :model="formstorage" label-width="160px" class="demo-form-inline">
              <!-- 充电效率 -->
              <el-form-item label="充电效率">
                <el-input
                  v-model="formstorage.chargeEfficiency"
                  clearable
                />
              </el-form-item>

              <!-- 放电效率 -->
              <el-form-item label="放电效率">
                <el-input
                  v-model="formstorage.dischargeEfficiency"
                  clearable
                />
              </el-form-item>

              <!-- 最小荷电状态 -->
              <el-form-item label="最小荷电状态">
                <el-input
                  v-model="formstorage.minSOC"
                  clearable
                />
              </el-form-item>

              <!-- 最大荷电状态 -->
              <el-form-item label="最大荷电状态">
                <el-input
                  v-model="formstorage.maxSOC"
                  clearable
                />
              </el-form-item>

              <!-- 充放电倍率 -->
              <el-form-item label="充放电倍率">
                <el-input
                  v-model="formstorage.rate"
                  clearable
                />
              </el-form-item>
            </el-form>
            </div>
        </el-card>
        <el-card shadow="hover" class="user-table" style="margin-top: 20px;">
          <div class="table-container">
                  <h3>储氢罐 </h3>
              <el-form :inline="true" :model="formtank" label-width="160px" class="demo-form-inline">
                <el-form-item label="几何容积(m3)">
                  <el-input
                    v-model="formtank.volume"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最高工作压力(MPa)">
                  <el-input
                    v-model="formtank.maxpressure"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="最低工作压力(MPa)">
                  <el-input
                    v-model="formtank.minpressure"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="大气压(MPa)">
                  <el-input
                    v-model="formtank.atmosphericpressure"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="有效储氢容积(m3/个)">
                  <el-input
                    v-model="formtank.storagevolume"
                    clearable
                  />
                </el-form-item>
              </el-form>
              </div>
        </el-card>
        <el-card shadow="hover" class="user-table" style="margin-top: 20px;">
          <div class="table-container">
                  <h3>制氢系统 </h3>
              <el-form :inline="true" :model="formHydrogenSystem" label-width="160px" class="demo-form-inline">
                <el-form-item label="辅机负荷系数">
                  <el-input
                    v-model="formHydrogenSystem.auxiliaryLoadFactor"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="每标方氢用电量(kw·h)">
                  <el-input
                    v-model="formHydrogenSystem.ElectricityPerNm3"
                    clearable
                  />
                </el-form-item>
              </el-form>
              </div>
        </el-card>
      </el-card>
    </el-col>
  </el-row>
  <!-- 遮罩层 -->
  <div class="overlay" v-if="isSettingsOpen" @click="closeSettings"></div>
  <!-- 设置面板 -->
  <div class="settings-panel" :class="{ active: isSettingsOpen }">
    <div class="settings-content">
      <h3>设置参数 - {{ currentImage.label }}</h3>
      <el-form label-width="120px">
        <el-form-item
          v-for="setting in currentImage.settingsSchema"
          :key="setting.key"
          :label="setting.label"
        >
          <el-input
            v-if="setting.type === 'text'"
            v-model="setting.num"
          ></el-input>
          <el-select
            v-else-if="setting.type === 'select'"
            v-model="setting.label"
          >
            <el-option
              v-for="option in setting.options"
              :label="option.label"
              :value="option.label"
            ></el-option>
          </el-select>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存</el-button>
          <el-button @click="closeSettings">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { it } from 'element-plus/es/locales.mjs';
import { reactive, ref,watch } from 'vue';

const activeNames = ref(["1"]);
const isSettingsOpen = ref(false); // 控制设置面板的显示和隐藏
const currentImage = ref({
  label: '',
  settingsSchema: []
}); // 当前选中的图片及其设置数据

const images = reactive([
  {
    name: 'wind',
    label: '风力发电',
    settingsSchema: [
      { key: 'minCapacity', label: '最小容量(MW)', type: 'text' ,num:'70'},
      { key: 'maxCapacity', label: '最大容量(MW)', type: 'text' ,num:'130'},
      { key: 'investmentCost', label: '投资成本(/KW)', type: 'text' ,num:'3600'},
      { key: 'maintenanceCost', label: '运维成本(/KW)', type: 'text' ,num:'98.8'},
      { key: 'lifespan', label: '使用寿命', type: 'text',num:'20' }
    ]
  },
  {
    name: 'pv',
    label: '光伏发电',
    settingsSchema: [
      { key: 'minCapacity', label: '最小容量(MW)', type: 'text' ,num:'0'},
      { key: 'maxCapacity', label: '最大容量(MW)', type: 'text' ,num:'0'},
      { key: 'investmentCost', label: '投资成本(/KW)', type: 'text' ,num:'2800'},
      { key: 'maintenanceCost', label: '运维成本(/KW)', type: 'text' ,num:'62.2'},
      { key: 'lifespan', label: '使用寿命(年)', type: 'text' ,num:'20'}
    ]
  },
  {
    name: 'storage',
    label: '储能系统',
    settingsSchema: [
      { key: 'minCapacity', label: '最小容量(MW)', type: 'text' ,num:'0'},
      { key: 'maxCapacity', label: '最大容量(MW)', type: 'text',num:'50' },
      { key: 'investmentCost', label: '投资成本(/KW)', type: 'text' ,num:'850'},
      { key: 'maintenanceCost', label: '运维成本(/KW)', type: 'text' ,num:'21.25'},
      { key: 'lifespan', label: '使用寿命(年)', type: 'text',num:'20'}
    ]
  },
  {
    name: 'electrolyzer',
    label: '制氢电解槽',
    settingsSchema: [
      { key: 'minCapacity', label: '最小容量(MW)', type: 'text' ,num:'55'},
      { key: 'maxCapacity', label: '最大容量(MW)', type: 'text' ,num:'130'},
      { key: 'investmentCost', label: '投资成本(/KW)', type: 'text' ,num:'1500'},
      { key: 'maintenanceCost', label: '运维成本(/KW)', type: 'text' ,num:'70.5'},
      { key: 'lifespan', label: '使用寿命(年)', type: 'text' ,num:'20'}
    ]
  },
  {
    name: 'tank',
    label: '储氢罐',
    settingsSchema: [
      { key: 'minCapacity', label: '最小个数', type: 'text' ,num:'0'},
      { key: 'maxCapacity', label: '最大个数', type: 'text' ,num:'10'},
      { key: 'investmentCost', label: '投资成本(/个)', type: 'text' ,num:'4000000'},
      { key: 'maintenanceCost', label: '运维成本(/KW)', type: 'text' ,num:'0'},
      { key: 'lifespan', label: '使用寿命(年)', type: 'text' ,num:'20'}
    ]
  },
  {
    name: 'grid',
    label: '电网连接',
    settingsSchema: [
      {
        key: 'gridType',
        label: '并网方式',
        type: 'select',
        options: [
          { label: '并网上网' },
          { label: '并网不上网' },
          { label: '离网' },
        ]
      },
    ]
  }
]
);
const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}.jpg`, import.meta.url).href;
};

// 打开设置面板
const openSettings = (item) => {
  currentImage.value = item; // 设置当前图片
  isSettingsOpen.value = true;
  document.body.style.overflow = 'hidden'; // 防止背景滚动
};

// 关闭设置面板
const closeSettings = () => {
  isSettingsOpen.value = false;
  document.body.style.overflow = ''; // 恢复背景滚动
};

// 保存设置
const saveSettings = () => {
  console.log(`保存的设置 - ${currentImage.value.label}:`, currentImage.value.settings);
  closeSettings();
};
const extractNumValues = () => {
  const numValues = {};

  images.forEach(image => {
    numValues[image.name] = {}; // 初始化每个系统的对象
    image.settingsSchema.forEach(setting => {
      if (setting.num !== undefined) {
        numValues[image.name][setting.key] = setting.num;
      }
    });
  });

  return numValues;
};

// 调用函数并打印结果
const numValues = ref(extractNumValues());
// 监听 currentImage.settingsSchema 的变化
watch(
  () => currentImage.value.settingsSchema,
  () => {
    numValues.value= extractNumValues();
    console.log(numValues.value);
    submitData(numValues.value);

  },
  { deep: true } // 深度监听，确保监听对象内部的变化
);

//提交数据 
const submitData = async() => {
  try {
    console.log("Sending numValues:", numValues.value); // 确保这是最新的数据
    const response = await axios.post('http://127.0.0.1:8080/calculate', {
      numValues: numValues.value
    }); 
    console.log(response);
  } catch (error) {
    console.error('请求失败:', error);
    alert('请求失败，请检查网络连接');
  }
};

const formstorage = ref({
  chargeEfficiency: '0.9', // 充电效率
  dischargeEfficiency: '0.9', // 放电效率
  minSOC: '20', // 最小荷电状态
  maxSOC: '100', // 最大荷电状态
  rate: '0.5' // 额定功率
});
const formtank = ref({
  volume:'2000',
  maxpressure:'1.6',
  minpressure:'0.3',
  atmosphericpressure:'0.101325',
  storagevolume:'25666'
});
const formHydrogenSystem = ref({
auxiliaryLoadFactor: '1', // 辅机负荷系数
ElectricityPerNm3: '5', // 每标方氢理论用电量（kWh）
});
</script>

<style scoped>
.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.image-with-label {
  text-align: center;
}

.image-item {
  margin-top: 20px;
  margin-left: 30px;
  width: 250px;
  height: 250px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
}

.image-item:hover {
  transform: scale(1.1); /* 鼠标悬停时放大 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 增强阴影效果 */
}

.image-label {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}
/* 遮罩层样式 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* 设置面板样式 */
.settings-panel {
  position: fixed;
  top: 0;
  right: -100%; /* 默认隐藏在右侧 */
  width: 350px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  transition: right 0.3s ease;
  z-index: 1001;
  overflow: auto;
}

.settings-panel.active {
  right: 0; /* 显示时移动到右侧 */
}

.settings-content {
  padding: 20px;
}

</style>