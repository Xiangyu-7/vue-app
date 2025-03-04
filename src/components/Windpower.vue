<template>
  <div class="component-item">
    <img :src="require(`../public/wind_power/wind_power_image.jpg`)">
    <el-button @click="showSettings = true">设置参数</el-button>
    <el-drawer
      v-model="showSettings"
      title="风电参数设置"
      direction="rtl"
    >
      <div class="settings-content">
        <el-form :model="formData">
          <el-form-item label="最大容量">
            <el-input v-model="formData.maxCapacity"></el-input>
          </el-form-item>
          <el-form-item label="最小容量">
            <el-input v-model="formData.minCapacity"></el-input>
          </el-form-item>
          <el-form-item label="投资成本">
            <el-input v-model="formData.investmentCost"></el-input>
          </el-form-item>
          <el-form-item label="运维成本">
            <el-input v-model="formData.operationCost"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'WindPower',
  data() {
    return {
      showSettings: false,
      formData: {
        maxCapacity: '',
        minCapacity: '',
        investmentCost: '',
        operationCost: ''
      }
    };
  }
};
</script>

<style scoped>
.component-item {
  width: 200px;
  margin: 10px;
  text-align: center;
}
img {
  width: 100%;
  height: auto;
}
</style>