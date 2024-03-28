<template>
  <div class="creat-datatable table-responsive">
    <table class="table" :class="tableClass">
      <thead>
        <tr>
          <th
            v-for="header in props.infos.headers"
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
            />
          </th>
        </tr>
      </thead>
      <tbody v-if="filteredData && filteredData.length > 0">
        <tr
          v-for="(data, index) in filteredData"
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
      <tbody v-else>
        <tr>
          <td :colspan="props.infos.headers.length">
            <slot v-if="slots['empty-state']" name="empty-state" />
            <p v-else class="text-center">Aucune donnée</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
import { DTInfo, SortDirection, FilterType } from "../types/datatable";
import SortingIcon from "./SortingIcon.vue";
import { computed, useSlots } from "vue";

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
  sort?: [string, SortDirection];
  filters?: { [key: string]: string };
  filterType?: FilterType;
  filterClass?: string;
  tableClass?: string;
}>();

const slots = useSlots();

const emit = defineEmits(["update:filters", "update:sort"]);

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

const sortModel = computed({
  get: () => props.sort,
  set: (value) => emit("update:sort", value),
});

const sortId = computed(() => (sortModel.value ? sortModel.value[0] : null));
const sortDirection = computed(() =>
  sortModel.value ? sortModel.value[1] : null
);

function onHeaderClicked(headerId: string) {
  const header = props.infos.headers.find((header) => header.id === headerId);
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
