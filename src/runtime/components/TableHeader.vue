<template>
  <thead>
    <tr>
      <th
        v-for="header in props.headers"
        :key="`${props.id}-DT-header-${header.id}`"
        scope="col"
        @click="onHeaderClicked(header.id)"
      >
        <slot
          v-if="slots[`header-${header.id}`]"
          :name="`header-${header.id}`"
          :data="header"
        />
        <div
          v-else
          class="creat-datatable-header"
          :class="{ 'creat-datatable-header-clickable': header.sortable }"
        >
          <span>{{ header.label }}</span>
          <div v-if="header.sortable ?? false" class="sorting-icons">
            <SortingIcon
              v-show="sortId === header.id && sortDirection"
              :direction="sortDirection"
            />
          </div>
        </div>
        <input
          v-if="header.filtering ?? false"
          v-model="filtersModel[header.id]"
          type="search"
          class="creat-datatable-header-input"
          :class="props.filterClass"
        >
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts" generic="T">
import { SortDirection, FilterType, DTHeader } from "../types/datatable";
import SortingIcon from "./SortingIcon.vue";
import { computed, useSlots } from "vue";

const props = defineProps<{
  id: string;
  headers: DTHeader[];
  sort?: [string, SortDirection];
  filters: { [key: string]: string };
  filterType?: FilterType;
  filterClass?: string;
}>();

const slots = useSlots();

const emit = defineEmits(["update:filters", "update:sort"]);

// Filtering
const filtersModel = computed({
  get: () => props.filters,
  set: (value) => emit("update:filters", value),
});

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
  const header = props.headers.find((header) => header.id === headerId);
  if (!header || !(header.sortable ?? true)) {
    return;
  }

  if (sortModel.value && sortModel.value[0] === headerId) {
    sortModel.value = [headerId, sortModel.value[1] === "asc" ? "desc" : "asc"];
  } else {
    sortModel.value = [headerId, "asc"];
  }
}
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
