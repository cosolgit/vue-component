<template>
  <div>
    <button @click="handleConfirm">显示弹窗</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleConfirm() {
      this.$ExConfirm({
        title: "这是一个弹窗",
        confirmBtnText: "确定",
        cancelBtnText: "取消",
      })
        .then((confirm) => {
          console.log(confirm);
        })
        .catch((cancel) => {
          console.log(cancel);
        });
    },
  },
};
</script>

<style scoped>
</style>