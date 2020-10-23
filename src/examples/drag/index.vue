<template>
  <div>
    <drag-wrap class="wrap" @watchData="watchData" :data="list">
      <drag-item class="item" v-for="(item, index) in list" :key="index">
        <template #drag>
          <div>可拖拽区域</div>
        </template>
        <div>{{ item }}</div>
      </drag-item>
    </drag-wrap>
  </div>
</template>

<script>
import { DragItem, DragWrap } from "com/drag";
export default {
  data() {
    return {
      list: ["111", "222", "333", "444", "555", "666", "777", "888", "999"],
    };
  },
  components: { DragItem, DragWrap },
  methods: {
    watchData(newList) {
      console.log("newList", newList);
    },
  },
};
</script>
<style scoped>
.wrap {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1;
  width: 50px;
  height: 50px;
  background-color: rgb(31, 173, 13);
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item div + div {
  user-select: none;
}
</style>
