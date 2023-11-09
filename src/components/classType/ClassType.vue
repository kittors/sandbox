<template>
  <span
    class="classText"
    :style="{
      color: spanInfo.color,
    }"
    v-show="isShow"
    >{{ spanInfo.textContent }}</span
  >
</template>

<script>
import eventBus from "../../js/eventBus";
export default {
  data() {
    return {
      isShow: true,
    };
  },
  props: {
    spanInfo: {
      type: Object,
      default: null,
    },
  },
  created() {},
  mounted() {
    eventBus.$on("changeSheet", (eventData) => {
      console.log(eventData, "切换了sheet表");
      if (eventData == 1) {
        this.isShow = false;
      } else if (eventData == 2) {
        this.isShow = true;
      }
    });
  },
};
</script>

<style lang="less" scoped>
span.classText {
  width: 100%;
  height: 100%;
  text-align: center;
  position: relative;
  text-align: center;
  font-weight: 600;
}
</style>
