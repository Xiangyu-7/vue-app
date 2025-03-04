import { createRouter, createWebHashHistory} from 'vue-router'

//制定路由规则
const routes = [
    {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [
        {
            path: 'home',
            name: 'home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: 'resource',
            name: 'resource',
            component: () => import('@/views/Resource.vue')
        },
        {
            path: 'calculate',
            name: 'calculate',
            component: () => import('@/views/Calculate.vue')
        },
        {
            path: 'analysis',
            name: 'analysis',
            component: () => import('@/views/Analysis.vue')
        },
        
    ]
    },
]



const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;