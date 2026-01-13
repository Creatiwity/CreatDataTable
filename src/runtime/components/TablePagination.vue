<template>
  <slot name="pagination" :current-page="props.currentPage" :max-page="props.maxPage" :change-page="changePage">
    <div :class="props.paginationConfig?.paginationClass">
      <button
        :disabled="props.currentPage <= 1"
        :class="props.paginationConfig?.previousButtonClass"
        @click="changePage(props.currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ props.currentPage }} of {{ props.maxPage }}</span>
      <button
        :disabled="props.currentPage >= props.maxPage"
        :class="props.paginationConfig?.nextButtonClass"
        @click="changePage(props.currentPage + 1)"
      >
        Next
      </button>
    </div>
  </slot>
</template>

<script setup lang="ts">
import type { PaginationConfig } from "../types/datatable";

const props = defineProps<{
  currentPage: number;
  maxPage: number;
  paginationConfig?: PaginationConfig;
}>();

const emit = defineEmits(["change-page"]);

function changePage(page: number) {
  if (page < 1 || page > props.maxPage) {
    return
  }
  emit("change-page", page);
}
</script>

