import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//import '@assets/less/index.css';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {createPinia} from 'pinia';
import "@/api/mock.js";
// import api from "@/api/api";

const pinia = createPinia();
const app = createApp(App);

// app.config.globalProperties.$api = api;
app.use(ElementPlus);
app.use(pinia);
app.use(router).mount('#app');
for (const [key, value] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, value);
}