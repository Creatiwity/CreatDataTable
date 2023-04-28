<template>
  <div class="table-responsive">
    <table class="table table-borderless">
      <thead>
        <tr>
          <th
            v-for="header in props.infos.headers"
            :key="`${props.id}-DT-header-${header.id}`"
            scope="col"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="props.infos.data && props.infos.data.length > 0">
        <tr
          v-for="(data, index) in props.infos.data"
          :key="`${id}-tr-${index}`"
        >
          <td
            v-for="header in props.infos.headers"
            :key="`${id}-td-${header.id}`"
          >
            <slot
              :name="header.id"
              :data="data"
            />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="8">
            <p class="text-center">
              Aucune donnée
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
import { DTInfo } from '../../types/datatabe';

const props = defineProps<{
  id: string;
  infos: DTInfo<T>;
}>();
</script>

<style scoped lang="scss"></style>
