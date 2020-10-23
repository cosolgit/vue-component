<template>
  <div
    @dragstart.stop="onDragstart"
    @dragenter.stop="onDragenter"
    @dragend.stop="onDragend"
    :draggable="!$slots.drag || isDrag"
    class="__drag_item"
    :style="{ cursor: !$slots.drag ? 'move' : '' }"
  >
    <slot name="drag"></slot>
    <slot>111</slot>
  </div>
</template>

<script>
//.stop阻止冒泡
import Emitter from "mixins/emitter";
export default {
  name: "DragItem",
  mixins: [Emitter],
  data() {
    return {
      isDrag: false,
    };
  },
  mounted() {
    if (this.$slots.drag) {
      this.setSlotAttr();
    }
    this.dispatch("DragWrap", "putChild", this.$el);
  },
  methods: {
    setSlotAttr() {
      //data 标签内联属性,text文本节点
      const slotVnode = this.$slots.default.find(vnode => !vnode.data && !vnode.text);
      //具名插槽无法获取真实dom
      const dragDom = slotVnode.elm.previousSibling;
      if (dragDom.previousSibling !== null) {
        throw "具名插槽内只能有一个根节点";
      }

      dragDom.addEventListener("mouseenter", () => {
        this.isDrag = true;
      });
      dragDom.addEventListener("mouseleave", () => {
        this.isDrag = false;
      });
      dragDom.style.cursor = "move";
    },
    onDragstart() {
      this.$el.style.opacity = 0.3;
      this.dispatch("DragWrap", "dragstart", this.$el);
    },
    onDragenter() {
      this.dispatch("DragWrap", "dragenter", this.$el);
    },
    onDragend() {
      this.$el.style.opacity = 1;
      this.dispatch("DragWrap", "dragend");
    },
  },
};
</script>
<style scoped>
.__drag_item {
  animation: shake 0.3s;
}
@keyframes shake {
  0% {
    transform: translate3d(-10%, 0, 0);
  }
  50% {
    transform: translate3d(10%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
