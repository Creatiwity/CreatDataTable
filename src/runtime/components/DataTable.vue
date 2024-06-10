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
          <td v-if="props.checkboxConfig" :class="props.checkboxConfig.tdClass">
            <input
              type="checkbox"
              :class="props.checkboxConfig.inputClass"
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
      :current-page="paginationCurrentPage"
      :max-page="paginationMaxPage"
      :pagination-config="props.paginationConfig"
      @change-page="changePage"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends { [key: number | string]: P}, P">
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
import { computed, ref, watch, useSlots } from "vue";

const slots = useSlots();

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
  onPageChange?: (page: number) => void;
  checkboxConfig?: CheckboxConfig;
  tableClass?: string;
}>();

const emit = defineEmits(["update:sort", "update:filters", "update:checkbox"]);

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

const paginationCurrentPage = ref(1);

watch(
  () => props.paginationConfig?.currentPage,
  (newCurrentPage) => {
    if (newCurrentPage) {
      paginationCurrentPage.value = newCurrentPage;
    }
  }
);

const maxPage = computed(() => {
  if (props.paginationConfig?.nbItems) {
    return Math.ceil(props.paginationConfig.nbItems / ITEMS_PER_PAGE);
  } else {
    return Math.ceil(filteredData.value.length / ITEMS_PER_PAGE);
  }
});

const paginationMaxPage = ref(maxPage);

watch(
  () => props.paginationConfig?.nbItems,
  (newNbItems) => {
    if (newNbItems) {
      paginationMaxPage.value = Math.ceil(newNbItems / ITEMS_PER_PAGE);
    }
  }
);

watch(filteredData, () => {
  paginationMaxPage.value = maxPage.value;
});

function changePage(page: number) {
  if (props.type === "remote") {
    props.onPageChange?.(page);
  } else {
    paginationCurrentPage.value = page;
  }
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

  if (props.type !== "remote" && props.paginationConfig) {
    const start = (paginationCurrentPage.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    data = data.slice(start, end);
  }

  return data;
});
</script>

<style scoped></style>
