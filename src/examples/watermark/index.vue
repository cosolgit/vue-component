<template>
  <div>
    <img v-watermark="{ src: src, text: 'yuba.douyu.com' }" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: require("./img/min.jpg"),
      a: false,
    };
  },
};
</script>

<style>
</style>