<template>
  <div>
    <TableView></TableView>
  </div>
</template>

<script>
import TableView from "../components/tableView/TableView.vue";
export default {
  components: {
    TableView,
  },
  mounted() {
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        console.warn("Ignored: ResizeObserver loop limit exceeded");
        return false;
      } else if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        // console.log(
        //   "ResizeObserver loop completed with undelivered notifications."
        // );
        return false;
      } else {
        return e;
      }
    });
  },
};
</script>

<style lang="less" scoped></style>
