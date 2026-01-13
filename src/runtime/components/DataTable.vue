<template>
  <div>
    <table class="table" :class="tableClass">
      <TableHeader
        :id="id"
        :headers="headers"
        :filters-class="filtersConfig?.class"
        :checkbox-config="checkboxConfig"
        :table-data="tableData"
        :sort="sortValue"
        :filters="filtersValue"
        :checkbox="checkboxValue"
        @update:sort="setSort"
        @update:filters="setFilters"
        @update:checkbox="setCheckbox"
      >
        <template
          v-for="header in headersWithHeaderSlot"
          :key="`${id}-header-${header.id}`"
          #[headerSlotName(header.id)]="slotProps"
        >
          <slot :name="headerSlotName(header.id)" v-bind="slotProps" />
        </template>
        <template v-if="slots['sorting-icon']" #sorting-icon="slotProps">
          <slot name="sorting-icon" v-bind="slotProps" />
        </template>
      </TableHeader>
      <tbody v-if="tableData.length > 0">
        <tr
          v-for="(data, index) in tableData"
          :key="`${id}-tr-${index}`"
          class="creat-datatable-row"
        >
          <td v-if="checkboxConfig">
            <slot name="checkbox-cell" :row="data" :checked="checkboxValue.includes(data)" :toggle-checkbox="() => toggleCheckbox(data)">
              <input
                type="checkbox"
                :class="checkboxConfig.class"
                :checked="checkboxValue.includes(data)"
                @click="toggleCheckbox(data)"
              />
            </slot>
          </td>
          <td
            v-for="header in headers"
            :key="`${id}-td-${header.id}`"
            :class="contentClassMap.get(header.id)"
          >
            <slot v-if="slots[header.id]" :name="header.id" :data="data" />
            <span v-else>{{ data[header.id] }}</span>
          </td>
        </tr>
      </tbody>
      <TableEmpty v-else :headers-nb="headers.length">
        <template #empty-state>
          <slot name="empty-state" />
        </template>
      </TableEmpty>
    </table>
    <TablePagination
      v-if="paginationConfig"
      :current-page="paginationCurrentPage"
      :max-page="maxPage"
      :pagination-config="paginationConfig"
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
import { computed, ref, watch, useSlots, toRef, toRefs } from "vue";
import { useTableState } from "../composables/useTableState";
import { useTableFiltering } from "../composables/useTableFiltering";

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
  checkboxConfig?: CheckboxConfig<T>;
  tableClass?: string;
}>();

const emit = defineEmits<{
  "update:sort": [[string, SortDirection] | undefined];
  "update:filters": [{ [key: string]: string }];
  "update:checkbox": [T[]];
}>();

const { id, infos, type, filtersConfig, paginationConfig, checkboxConfig } =
  toRefs(props);

const headers = computed(() => infos.value.headers);
const rows = computed(() => infos.value.data ?? []);
const content = computed(() => infos.value.content ?? []);
const isRemote = computed(() => type.value === "remote");

const headersWithHeaderSlot = computed(() => {
  const slotNames = new Set(Object.keys(slots));
  return headers.value.filter((header) =>
    slotNames.has(`header-${header.id}`)
  );
});

const { sortValue, filtersValue, checkboxValue, setSort, setFilters, setCheckbox } =
  useTableState({
    sort: toRef(props, 'sort'),
    filters: toRef(props, 'filters'),
    checkbox: toRef(props, 'checkbox'),
    onSortUpdate: (v) => emit("update:sort", v),
    onFiltersUpdate: (v) => emit("update:filters", v),
    onCheckboxUpdate: (v) => emit("update:checkbox", v),
  });

const { filteredData } = useTableFiltering(
  () => rows.value,
  () => headers.value,
  () => filtersValue.value,
  type.value
);

const contentClassMap = computed(() => {
  const map = new Map<string, string | undefined>();
  content.value.forEach((c) => {
    if (c.tdClass) {
      map.set(c.id, c.tdClass);
    }
  });
  return map;
});

// Pagination
const INITIAL_PAGE = 1;
const itemsPerPage = computed(() => paginationConfig.value?.itemsPerPage ?? 5);

const paginationCurrentPage = ref(INITIAL_PAGE);

watch(
  () => paginationConfig.value?.currentPage,
  (newCurrentPage) => {
    if (newCurrentPage) {
      paginationCurrentPage.value = newCurrentPage;
    }
  }
);

const maxPage = computed(() => {
  const total = paginationConfig.value?.nbItems ?? filteredData.value.length;
  return Math.ceil(total / itemsPerPage.value) || 1;
});

watch([filteredData, () => paginationConfig.value?.nbItems], () => {
  if (paginationCurrentPage.value > maxPage.value) {
    paginationCurrentPage.value = INITIAL_PAGE;
  }
});

function changePage(page: number) {
  if (isRemote.value) {
    props.onPageChange?.(page);
  } else {
    paginationCurrentPage.value = page;
  }
}

function toggleCheckbox(row: T) {
  const idKey = checkboxConfig.value?.idKey as keyof T | undefined;
  const isSelected = idKey
    ? checkboxValue.value.some((r) => r[idKey] === row[idKey])
    : checkboxValue.value.includes(row);

  if (!isSelected) {
    setCheckbox([...checkboxValue.value, row]);
  } else {
    setCheckbox(
      idKey
        ? checkboxValue.value.filter((r) => r[idKey] !== row[idKey])
        : checkboxValue.value.filter((r) => r !== row)
    );
  }
}

const tableData = computed(() => {
  let pageRows = filteredData.value;

  if (!isRemote.value && paginationConfig.value) {
    const start = (paginationCurrentPage.value - 1) * itemsPerPage.value;
    pageRows = pageRows.slice(start, start + itemsPerPage.value);
  }

  return pageRows;
});

const headerSlotName = (headerId: string) => `header-${headerId}`;
</script>

