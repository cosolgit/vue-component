import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        component: () => import("examples/home"),
    },
    {
        path: "/imgLabel",
        component: () => import("examples/imgLabel"),
    },
    {
        path: "/slideCheck",
        component: () => import("examples/slideCheck"),
    },
];
const router = new Router({ routes });

export default router;
