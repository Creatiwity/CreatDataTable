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
            <div
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
          </th>
        </tr>
      </thead>
      <tbody v-if="props.infos.data && props.infos.data.length > 0">
        <tr
          v-for="(data, index) in props.infos.data"
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
          <td colspan="8">
            <p class="text-center">Aucune donnée</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
import { DTInfo, SortDirection } from "../types/datatable";
import SortingIcon from "./SortingIcon.vue";
import { computed } from "vue";

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
  sort?: [string, SortDirection];
  tableClass?: string;
}>();

const emit = defineEmits(["update:sort"]);

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
