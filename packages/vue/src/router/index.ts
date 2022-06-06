import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    {
        path:"/",
        redirect:"/graph"
    },

    // {
    //     path: "/",
    //     name: "Home",
    //     component: Home,
    //     children: [
    //         {
    //             path: "/user_role",
    //             name: "userRole",

    //             component: () => import( /* webpackChunkName: "dashboard" */ "../views/RoleManage.vue")
    //         },
    //     ]
    // },
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
