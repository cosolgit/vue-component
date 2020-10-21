<template>
    <div id="app">
        <router-link to="home" tag="button">去首页</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
//app.vue 是整个项目第一个被渲染的组件，而且只会渲染一次（即使切换路由，app.vue 也不会被再次渲染）
//组件渲染顺序 ,子->父  ;  父created->子created->子mounted->父mounted
export default {
    name: "App",
    provide() {
        return {
            app: this,
        };
    },
    data() {
        return {
            userInfo: null,
        };
    },
    mounted() {
        this.changeUserInfo();
    },
    methods: {
        changeUserInfo(d = "i want kill you") {
            this.userInfo = d;
        },
    },
    watch: {
        userInfo(newV, oldV) {
            console.log(newV, oldV);
        },
    },
};
</script>

<style></style>
