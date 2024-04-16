<template>
  <div>
    <table class="table" :class="tableClass">
      <TableHeader
        :id="props.id"
        v-model:sort="sortModel"
        v-model:filters="filtersModel"
        v-model:checkbox="checkboxModel"
        :headers="props.infos.headers"
        :filters-class="props.filtersConfig?.class"
        :checkbox-config="props.checkboxConfig"
        :table-data="tableData"
      >
        <template
          v-for="header in props.infos.headers"
          :key="`${id}-header-${header.id}`"
        >
          <slot :name="`header-${header.id}`" :data="header" />
        </template>
      </TableHeader>
      <tbody v-if="tableData && tableData.length > 0">
        <tr
          v-for="(data, index) in tableData"
          :key="`${id}-tr-${index}`"
          class="creat-datatable-row"
        >
          <td v-if="props.checkboxConfig">
            <input
              type="checkbox"
              :class="props.checkboxConfig.class"
              :checked="checkboxModel.includes(data)"
              @click="updateCheckbox(data)"
            >
          </td>
          <td
            v-for="header in props.infos.headers"
            :key="`${id}-td-${header.id}`"
            :class="
              props.infos.content?.find((content) => content.id === header.id)
                ?.tdClass
            "
          >
            <slot v-if="slots[header.id]" :name="header.id" :data="data" />
            <span v-else>{{ data[header.id] }}</span>
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

<script
  setup
  lang="ts"
  generic="T extends { [key: number | string]: P}, P"
>
import {
  type DTInfo,
  type SortDirection,
  type DTType,
  type CheckboxConfig,
  type PaginationConfig,
  type FiltersConfig,
} from "../types/datatable";
import TablePagination from "./TablePagination.vue";
import TableEmpty from "./TableEmpty.vue";
import TableHeader from "./TableHeader.vue";
import { computed } from "vue";
import { useSlots } from "vue";

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
  sort?: [string, SortDirection];
  filters?: { [key: string]: string };
  currentPage?: number;
  checkbox?: T[];
  type?: DTType;
  filtersConfig?: FiltersConfig;
  paginationConfig?: PaginationConfig;
  checkboxConfig?: CheckboxConfig;
  tableClass?: string;
}>();

const slots = useSlots();

const emit = defineEmits([
  "update:sort",
  "update:filters",
  "update:currentPage",
  "update:checkbox",
]);

// Sorting
const sortModel = computed({
  get: () => props.sort,
  set: (value) => emit("update:sort", value),
});

// Filtering
const filtersModel = computed({
  get: () => props.filters ?? {},
  set: (value) => emit("update:filters", value),
});

const filteredData = computed(() => {
  if (props.type === "remote") {
    return props.infos.data;
  }

  return props.infos.data.filter((data: T) =>
    props.infos.headers.every((header) => {
      if (!filtersModel.value[header.id]) {
        return true;
      }

      const value = data[header.id];

      if (value == null || value.toString == null) {
        return false;
      }

      return value
        .toString()
        .toLowerCase()
        .includes(filtersModel.value[header.id].toLowerCase());
    })
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

// Checkbox
const checkboxModel = computed({
  get: () => props.checkbox ?? [],
  set: (value) => emit("update:checkbox", value),
});

function updateCheckbox(data: T) {
  if (!checkboxModel.value.includes(data)) {
    checkboxModel.value.push(data);
  } else {
    const index = checkboxModel.value.indexOf(data);
    if (index !== -1) {
      checkboxModel.value.splice(index, 1);
    }
  }
}

// Table data
const tableData = computed(() => {
  let data = props.infos.data;

  data = filteredData.value;

  if (props.type !== "remote") {
    const start = (currentPageModel.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    data = data.slice(start, end);
  }

  return data;
});
</script>

<style scoped>
</style>
