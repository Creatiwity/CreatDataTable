<template>
  <slot
    v-if="slots['pagination']"
    name="pagination"
    :decrease-page="() => changePage(props.currentPage - 1)"
    :increase-page="() => changePage(props.currentPage + 1)"
  />
  <div v-else>
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
import { useSlots } from "vue";

const props = defineProps<{
  currentPage: number;
  maxPage: number;
}>();

const slots = useSlots();

const emit = defineEmits(["change-page"]);

function changePage(page: number) {
  if (page >= 1 && page <= props.maxPage) {
    emit("change-page", page);
  }
}
</script>

<style scoped></style>
