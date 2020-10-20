<template>
    <div>
        <router-link to="home" tag="button">去首页</router-link>
        <div style="margin:50px;padding:50px;border:1px solid red">
            <img-label :src="require('./img/timg.jpg')"></img-label>
        </div>
    </div>
</template>

<script>
import ImgLabel from "com/imgLabel";
export default {
    components: { ImgLabel },
    data() {
        return {};
    },
};
</script>
<style scoped></style>
