<template>
    <el-aside :width="width"  class = 'el-aside'  >
        <el-menu
        text-color = '#fff'
        background-color = '#545c64'
        :collapse = "isCollapse"
      >
        <h3 v-show="!isCollapse" >容量配置优化平台</h3>
        <h3 v-show="isCollapse" >后台</h3>
        <!-- 子菜单 -->
        <!-- <el-sub-menu 
        v-for = "item in hasChildren" 
            :index = "item.path"
            :key = "item.path"
        >
          <template #title>
            <component class = 'icons':is="item.icon" ></component>
            <span>{{item.label}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
            v-for = "(subItem,subIndex) in item.Children"
            :index = "subItem.path"
            :key = "subItem.path" 
            >
            <component class = 'icons':is="subItem.icon" ></component>
            <span>{{subItem.label}}</span>
            </el-menu-item>
          
          </el-menu-item-group>
        </el-sub-menu> -->
        
        <el-menu-item 
            v-for = "item in noChildren"
            :index = "item.path"
            :key = "item.path"
            @click="handleMenu(item)"
        >           
          <component class = 'icons':is="item.icon" ></component>
            <span>{{item.label}}</span>

        </el-menu-item>
      </el-menu>
    </el-aside>
</template>

<script setup>
import { ref,computed } from 'vue'
import {useAllDataStore} from '@/stores'
import {useRouter,useRoute} from 'vue-router'
const list = ref([
    {
        path: '/home',
        name: 'home',
        label: '能源方案',
        icon: 'house',
        url: 'home'
    },
    {
        path: '/resource',
        name: 'resource',
        label: '资源配置',
        icon: 'info',
        url: 'resource'
    },
    {
        path: '/calculate',
        name: 'calculate',
        label: '方案计算',
        icon: 'info',
        url: 'calculator'
    }, {
        path: '/analysis',
        name: 'analysis',
        label: '结果分析',
        icon: 'info',
        url: 'analysis'

    },
    {
        path: 'other',
        label: '其他',
        icon: 'location',
        children: [
            {
                path: '/page1',
                name: 'page1',
                label: '页面1',
                icon: 'setting',
                url: 'Page1'
            },
            {
                path: '/page2',
                name: 'page2',
                label: '页面2',
                icon: 'document',
                url: 'Page2'
            }
        ]
    }
])
const noChildren = computed(() => {
    return list.value.filter(item => !item.children)
})
const hasChildren = computed(() => {
    return list.value.filter(item =>  item.children)
})
const store = useAllDataStore()
const isCollapse = computed(()=>store.state.isCollapse)
// width 
const width = computed(()=>store.state.isCollapse ? '64px' : '180px')
const router = useRouter()
const route = useRoute()
const handleMenu = (item) => {
    router.push(item.path)
}
</script>

<style lang="less" scoped>
.icons {
    width: 20px;
    height: 20px;
    font-size: 18px;
    margin-right: 10px;
}
.el-menu {
    border-right: none;
    h3{
      line-height: 48px;
      color: #fff;
      text-align: center;
    }
    
}
.el-aside {
  height: 100vh;
  background-color: #545c64;

}

.el-container {
  height: 100vh; /* 确保父容器高度撑满 */
}
</style>