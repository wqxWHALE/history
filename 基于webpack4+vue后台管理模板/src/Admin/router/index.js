import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/index.vue'
import Guide from '../views/guide/index.vue'
import Dashboard from '../views/dashboard/index.vue'
import Customer from '../views/customer/index.vue'
import CustomerOrder from '../views/customerOrder/index.vue'
Vue.use(Router);

export const constantRoutes = [
    {
        path: '/login',
        component:Login
    },
    {
        path: '/',
        redirect: '/index',
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/index',
        component: Guide,
        redirect:'/dashboard',
        hidden: true,
        meta: {
            requireAuth: true
        },
        children:[
            {
                path: '/dashboard',
                component: Dashboard,
                hidden: true,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/customer',
                component: Customer,
                hidden: true,
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/customerOrder',
                component: CustomerOrder,
                hidden: true,
                meta: {
                    requireAuth: true
                }
            }
        ]
    },
];

const createRouter = () => new Router({
    routes: constantRoutes
});

const router = createRouter();

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        console.log("token:"+token);
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        window.location.reload();
        // router.replace(router.history.pending.fullPath);
    }else{
        console.log(error)
    }
});

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher // reset router
}


export default router;


