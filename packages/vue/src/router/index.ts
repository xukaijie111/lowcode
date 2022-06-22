import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';

const routes = [
    {
        path:"/",
        redirect:"/process"
    },

    {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path:"/process",
                name:"Process",
                component: () => import( /* webpackChunkName: "login" */ "../views/Process.vue")
            },
        ]
    },
  
    {
        path:"/graph/:id?",
        name:"Graph",
        component: () => import( /* webpackChunkName: "login" */ "../views/Graph.vue")
    },
    // {
    //     path: "/login",
    //     name: "Login",
    //     meta: {
    //         title: '登录'
    //     },
    //     component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {

    return next()
});

export default router;
