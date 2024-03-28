<template>
  <div>
    <button
      :disabled="currentPage <= 1"
      @click="changePage(props.currentPage - 1)"
    >
      Previous
    </button>
    <span>Page {{ props.currentPage }} of {{ props.maxPage }}</span>
    <button
      :disabled="currentPage >= props.maxPage"
      @click="changePage(props.currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  currentPage: number;
  maxPage: number;
}>();

const emit = defineEmits(["change-page"]);

function changePage(page: number) {
  if (page >= 1 && page <= props.maxPage) {
    console.log(page);
    emit("change-page", page);
  }
}
</script>

<style scoped></style>
