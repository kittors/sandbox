<template>
  <div>
    <vxe-radio v-model="vall" label="1">表样</vxe-radio>
    <vxe-radio v-model="vall" label="2">类型</vxe-radio>
  </div>
</template>

<script>
import eventBus from "../../js/eventBus";
export default {
  data() {
    return {
      vall: "1",
    };
  },
  watch: {
    vall(newValue, oldValue) {
      //   console.log(typeof newValue, oldValue);
      switch (newValue) {
        case "1":
          this.$emit("changeSheet", newValue);
          eventBus.$emit("changeSheet", newValue);
          break;
        case "2":
          this.$emit("changeSheet", newValue);
          eventBus.$emit("changeSheet", newValue);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
