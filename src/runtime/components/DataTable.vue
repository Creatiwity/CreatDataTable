<template>
  <div class="creat-datatable table-responsive">
    <table class="table" :class="tableClass">
      <TableHeader
        :id="props.id"
        v-model:sort="sortModel"
        v-model:filters="filtersModel"
        :headers="props.infos.headers"
      >
        <template
          v-for="slotName in Object.keys($slots).filter((slot) =>
            slot.startsWith('header-')
          )"
          :key="slotName"
          #[slotName]="slotData"
        >
          <slot :name="slotName" :data="slotData.data" />
        </template>
      </TableHeader>
      <tbody v-if="tableData && tableData.length > 0">
        <tr
          v-for="(data, index) in tableData"
          :key="`${id}-tr-${index}`"
          class="creat-datatable-row"
        >
          <td
            v-for="header in props.infos.headers"
            :key="`${id}-td-${header.id}`"
          >
            <slot :name="header.id" :data="data" />
          </td>
        </tr>
      </tbody>
      <TableEmpty v-else :headers-nb="props.infos.headers.length">
        <template #empty-state>
          <slot name="empty-state" />
        </template>
      </TableEmpty>
    </table>
    <TablePagination
      v-if="props.paginationConfig"
      :current-page="currentPageModel"
      :max-page="maxPage"
      @change-page="changePage"
    >
      <template #pagination="{ decreasePage, increasePage }">
        <slot
          name="pagination"
          :decrease-page="decreasePage"
          :increase-page="increasePage"
        />
      </template>
    </TablePagination>
  </div>
</template>

<script setup lang="ts" generic="T">
import {
  type DTInfo,
  type SortDirection,
  type FilterType,
  type PaginationType,
} from "../types/datatable";
import TablePagination from "./TablePagination.vue";
import TableEmpty from "./TableEmpty.vue";
import TableHeader from "./TableHeader.vue";
import { computed } from "vue";

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
  sort?: [string, SortDirection];
  filters?: { [key: string]: string };
  filtersConfig?: {
    filterType?: FilterType;
    filterClass?: string;
  };
  currentPage?: number;
  paginationConfig?: {
    paginationType?: PaginationType;
    itemsPerPage?: number;
  };
  tableClass?: string;
}>();

const emit = defineEmits([
  "update:filters",
  "update:currentPage",
  "update:sort",
]);

// Filtering
const filtersModel = computed({
  get: () => props.filters ?? {},
  set: (value) => emit("update:filters", value),
});

const filteredData = computed(() => {
  if (props.filtersConfig?.filterType === "remote") {
    return props.infos.data;
  }

  return props.infos.data.filter((item: any) =>
    props.infos.headers.every(
      (header) =>
        !filtersModel.value[header.id] ||
        item[header.id]
          .toString()
          .toLowerCase()
          .startsWith(filtersModel.value[header.id].toLowerCase())
    )
  );
});

// Pagination
const ITEMS_PER_PAGE = props.paginationConfig?.itemsPerPage ?? 5;

const maxPage = computed(() => {
  return Math.ceil(filteredData.value.length / ITEMS_PER_PAGE);
});

const currentPageModel = computed({
  get: () => props.currentPage ?? 1,
  set: (value) => {
    emit("update:currentPage", value);
  },
});

function changePage(page: number) {
  currentPageModel.value = page;
}

// Sorting
const sortModel = computed({
  get: () => props.sort,
  set: (value) => emit("update:sort", value),
});

// Table data
const tableData = computed(() => {
  let data = props.infos.data;

  data = filteredData.value;

  if (
    props.paginationConfig &&
    props.paginationConfig.paginationType !== "remote"
  ) {
    const start = (currentPageModel.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    data = data.slice(start, end);
  }

  return data;
});
</script>

<style scoped>
.creat-datatable table {
  border-collapse: collapse;
  width: 100%;
}

.creat-datatable .creat-datatable-row:nth-child(even) {
  background-color: #ebe8e8;
}

.creat-datatable .creat-datatable-row:hover {
  background-color: #dbd1d1;
}
</style>
