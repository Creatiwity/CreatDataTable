<template>
  <thead>
    <tr>
      <th v-if="props.checkboxConfig">
        <slot name="checkbox-header" :checked="headerCheckboxChecked" :toggle-checkbox="updateHeaderCheckbox">
          <input
            type="checkbox"
            :class="props.checkboxConfig.class"
            :checked="headerCheckboxChecked"
            @click="updateHeaderCheckbox"
          >
        </slot>
      </th>
      <th
        v-for="header in props.headers"
        :key="`${props.id}-DT-header-${header.id}`"
        scope="col"
        :class="header.thClass"
        @click="onHeaderClicked(header.id)"
      >
        <slot
          v-if="slots[`header-${header.id}`]"
          :name="`header-${header.id}`"
          :data="header"
          :sort-id="sortId"
          :sort-direction="sortDirection"
          :toggle-sort="() => onHeaderClicked(header.id)"
          :set-filter="(value: string) => setFilter(header.id, value)"
        />
        <div
          v-else
          class="creat-datatable-header"
          :class="{ 'creat-datatable-header-clickable': header.sortable }"
        >
          <span>{{ header.label }}</span>
          <div v-if="header.sortable" class="sorting-icons">
            <slot name="sorting-icon" :direction="sortDirection" :header-id="header.id">
              <SortingIcon
                v-show="sortId === header.id && sortDirection"
                :direction="sortDirection"
              />
            </slot>
          </div>
        </div>
        <input
          v-if="header.filtering ?? false"
          type="search"
          class="creat-datatable-header-input"
          :class="props.filtersClass"
          :value="filtersModel[header.id] ?? ''"
          @input="onFilterInput(header.id, $event)"
        >
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts" generic="T">
import {
  type SortDirection,
  type DTHeader,
  type CheckboxConfig,
} from "../types/datatable";
import SortingIcon from "./SortingIcon.vue";
import { computed, useSlots } from "vue";

const props = defineProps<{
  id: string;
  headers: DTHeader[];
  sort?: [string, SortDirection];
  filters: { [key: string]: string };
  checkbox: T[];
  checkboxConfig?: CheckboxConfig<T>;
  filtersClass?: string;
  tableData: T[];
}>();

const slots = useSlots();

const emit = defineEmits(["update:sort", "update:filters", "update:checkbox"]);

const headerCheckboxChecked = computed(
  () =>
    props.tableData.length >= 1 &&
    checkboxModel.value.length >= props.tableData.length
);

// Sorting
const sortModel = computed({
  get: () => props.sort,
  set: (value) => emit("update:sort", value),
});

const sortId = computed(() => (sortModel.value ? sortModel.value[0] : null));
const sortDirection = computed(() =>
  sortModel.value ? sortModel.value[1] : null
);

function onHeaderClicked(headerId: string) {
  const header = props.headers.find((h) => h.id === headerId);
  if (!header?.sortable) {
    return;
  }

  if (sortModel.value?.[0] === headerId) {
    sortModel.value = [headerId, sortModel.value[1] === "asc" ? "desc" : "asc"];
  } else {
    sortModel.value = [headerId, "asc"];
  }
}

// Filtering
const filtersModel = computed({
  get: () => props.filters ?? {},
  set: (value) => emit("update:filters", value),
});

function setFilter(headerId: string, value: string) {
  const trimmedValue = value.trim();
  const nextFilters = { ...filtersModel.value };

  if (trimmedValue === "") {
    delete nextFilters[headerId];
  } else {
    nextFilters[headerId] = value;
  }

  filtersModel.value = nextFilters;
}

function onInput() {
  if (props.checkboxConfig?.overFilterMode === "delete") {
    checkboxModel.value = [];
  }
}

function onFilterInput(headerId: string, event: Event) {
  const target = event.target as HTMLInputElement | null;
  setFilter(headerId, target?.value ?? "");
  onInput();
}

// Checkbox
const checkboxModel = computed({
  get: () => props.checkbox,
  set: (value) => emit("update:checkbox", value),
});

function updateHeaderCheckbox() {
  if (checkboxModel.value.length >= props.tableData.length) {
    checkboxModel.value = [];
  } else {
    checkboxModel.value = props.tableData.map((data) => data);
  }
}
</script>

<style scoped>
.creat-datatable-header {
  display: flex;
  flex-direction: row;
}

.creat-datatable-header-clickable {
  cursor: pointer;
}

.creat-datatable-header-input {
  display: flex;
}

table thead tr th .sorting-icons {
  width: 16px;
  height: 16px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
}
</style>
