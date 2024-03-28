<template>
  <div class="creat-datatable table-responsive">
    <table class="table" :class="tableClass">
      <TableHeader
        :id="props.id"
        v-model:sort="sortModel"
        v-model:filters="filtersModel"
        :headers="props.infos.headers"
      />
      <tbody v-if="currentPageData && currentPageData.length > 0">
        <tr
          v-for="(data, index) in currentPageData"
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
      <TableEmpty v-else :headers-nb="props.infos.headers.length" />
    </table>
    <TablePagination
      :current-page="currentPage"
      :max-page="maxPage"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import { DTInfo, SortDirection, FilterType } from "../types/datatable";
import TablePagination from "./TablePagination.vue";
import TableEmpty from "./TableEmpty.vue";
import TableHeader from "./TableHeader.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
  sort?: [string, SortDirection];
  filters?: { [key: string]: string };
  filterType?: FilterType;
  filterClass?: string;
  tableClass?: string;
  pagination?: {
    itemsPerPage: number;
  };
}>();

const emit = defineEmits(["update:filters", "update:sort"]);

// Filtering
const filtersModel = computed({
  get: () => props.filters ?? {},
  set: (value) => emit("update:filters", value),
});

const filteredData = computed(() => {
  if (props.filterType === "remote") {
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
const currentPage = ref(1);

const ITEMS_PER_PAGE = props.pagination?.itemsPerPage ?? 5;

const maxPage = computed(() => {
  return Math.ceil(props.infos.data.length / ITEMS_PER_PAGE);
});

const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return props.infos.data.slice(start, end);
});

function changePage(page: number) {
  currentPage.value = page;
}

// Sorting
const sortModel = computed({
  get: () => props.sort,
  set: (value) => emit("update:sort", value),
});
</script>

<style scoped>
.creat-datatable table {
  border-collapse: collapse;
  width: 100%;
}

.creat-datatable .creat-datatable-header {
  display: flex;
  flex-direction: row;
}

.creat-datatable .creat-datatable-header-clickable {
  cursor: pointer;
}

.creat-datatable .creat-datatable-header-input {
  display: flex;
}

.creat-datatable table thead tr th .sorting-icons {
  width: 16px;
  height: 16px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 3px;
}

.creat-datatable .creat-datatable-row:nth-child(even) {
  background-color: #ebe8e8;
}

.creat-datatable .creat-datatable-row:hover {
  background-color: #dbd1d1;
}
</style>
