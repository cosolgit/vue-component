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
    {
        path: "/exConfirm",
        component: () => import("examples/exConfirm"),
    },
    {
        path: "/countDown",
        component: () => import("examples/countDown"),
    },
    {
        path: "/drag",
        component: () => import("examples/drag"),
    }
];
const router = new Router({ routes });

export default router;
