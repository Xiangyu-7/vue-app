    <template>
    <div class ="common-layout">
      <el-container class="lay-container">
      <!-- 自定义左侧的组件 -->
      <common-aside />
      <el-container>
      <el-header>
        <common-header />
      </el-header>
      <common-tab/>
      <el-main class="right-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
        </div>
    </template>

    <script setup>
    import CommonAside from '@/components/CommonAside.vue';
    import CommonHeader from '@/components/CommonHeader.vue';
    import router from '../router';
    import CommonTab from '@/components/CommonTab.vue'
    </script>

    <style scoped lang = "less">
    .common-layout,.lay-container { 
        overflow: hidden;
        height: 100vh;
    }
    .el-header {
         background-color: #333;

     }
    .right-main { 
         display: flex;
         height: 100%;
     }
    // .common-layout {
    //   overflow: hidden; /* 禁止容器滚动 */
    //   height: 100vh; /* 容器高度占满视口 */
    //   }
    </style>