<template>
  <div ref="wrap" @dragenter.prevent @dragover.prevent>
    <slot />
  </div>
</template>

<script>
export default {
  name: "DragWrap",
  props: {
    data: Array,
  },
  data: () => ({}),
  created() {
    this.toDom = "";
    this.fromDom = "";
    this.children = [];
    this.$on("putChild", child => {
      this.children.push(child);
    });
    this.$on("dragstart", this.onDragstart);
    this.$on("dragenter", this.onDragenter);
    this.$on("dragend", this.onDragend);
  },
  methods: {
    onDragstart(el) {
      this.fromDom = el;
    },
    onDragenter(el) {
      if (this.fromDom === el) return;
      this.toDom = el;

      if (this.isPreviousNode(this.fromDom, this.toDom)) {
        this.$refs.wrap.insertBefore(this.fromDom, this.toDom);
      } else {
        this.$refs.wrap.insertBefore(this.fromDom, this.toDom.nextSibling);
      }
    },
    onDragend() {
      if (!this.data.length) return;
      const realDomOrder = [...this.$el.children].filter(child =>
        child.classList.contains("__drag_item")
      );
      this.getDataOrder(realDomOrder, this.children);
    },
    getDataOrder(realList, afterDragList) {
      const order = realList
        .map(list => afterDragList.findIndex(item => item === list))
        .map(index => this.data[index]);
      this.$emit("watchData", order);
    },
    isPreviousNode(from, to) {
      //to是否在from前面
      while (from.previousSibling) {
        if (to === from.previousSibling) {
          return true;
        }
        from = from.previousSibling;
      }
    },
  },
};
</script>
<style scoped></style>
