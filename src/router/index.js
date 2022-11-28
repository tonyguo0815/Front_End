import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        name: 'Home',
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path: '/alert_list',
                name: 'AlertList',
                component: () => import('@/components/pages/AlertList.vue'),
            },
            {
                path: '/notify_management',
                name: 'NotifyManagement',
                component: () => import('@/components/pages/NotifyManagement.vue'),
            },
            {
                path: '/channel_management',
                name: 'ChannelManagement',
                component: () => import('@/components/pages/ChannelManagement.vue'),
            },
            {
                path: '/camera_management',
                name: 'CameraManagement',
                component: () => import('@/components/pages/CameraManagement.vue'),
            },
            {
                path: '/account_management',
                name: 'AccountManagement',
                component: () => import('@/components/pages/AccountManagement.vue'),
            },
        ]
    },
    // {
    //     path: '/pages',
    //     redirect: '/pages/404',
    //     name: 'Pages',
    //     component: {
    //       render() {
    //         return h(resolveComponent('router-view'))
    //       },
    //     },
    //     children: [
    //       {
    //         path: '404',
    //         name: 'Page404',
    //         component: () => import('@/views/pages/Page404.vue'),
    //       },
    //       {
    //         path: '500',
    //         name: 'Page500',
    //         component: () => import('@/views/pages/Page500.vue'),
    //       },
    //       {
    //         path: 'login',
    //         name: 'Login',
    //         component: () => import('@/views/pages/Login.vue'),
    //       },
    //       {
    //         path: 'register',
    //         name: 'Register',
    //         component: () => import('@/views/pages/Register.vue'),
    //       },
    //     ],
    //   },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    }
})  

export default router