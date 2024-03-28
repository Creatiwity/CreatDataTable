<template>
  <tbody>
    <tr>
      <td :colspan="props.headersNb">
        <slot v-if="slots['empty-state']" name="empty-state" />
        <p v-else class="text-center">Aucune donnée</p>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts" generic="T">
import { useSlots } from "vue";

const props = defineProps<{
  headersNb: number;
}>();

const slots = useSlots();
</script>
