import { ref, shallowRef, watch, computed, type Ref } from 'vue'
import type { SortDirection } from '../types/datatable'

interface UseTableStateOptions<T> {
  sort?: Ref<[string, SortDirection] | undefined>
  filters?: Ref<{ [key: string]: string } | undefined>
  checkbox?: Ref<T[] | undefined>
  onSortUpdate: (value: [string, SortDirection] | undefined) => void
  onFiltersUpdate: (value: { [key: string]: string }) => void
  onCheckboxUpdate: (value: T[]) => void
}

export function useTableState<T>(options: UseTableStateOptions<T>) {
  const internalSort = ref<[string, SortDirection] | undefined>(options.sort?.value)
  const internalFilters = ref<{ [key: string]: string }>(options.filters?.value ?? {})
  const internalCheckbox = shallowRef<T[]>(options.checkbox?.value ?? [])

  // Sync props → internal (one-way, prevents race conditions)
  if (options.sort) {
    watch(
      options.sort,
      (next) => {
        if (next !== internalSort.value) {
          internalSort.value = next
        }
      },
      { immediate: false }
    )
  }

  if (options.filters) {
    watch(
      options.filters,
      (next) => {
        if (next !== undefined) {
          internalFilters.value = { ...next }
        }
      },
      { immediate: false }
    )
  }

  if (options.checkbox) {
    watch(
      options.checkbox,
      (next) => {
        if (next !== undefined && next !== internalCheckbox.value) {
          internalCheckbox.value = next
        }
      },
      { immediate: false }
    )
  }

  const sortValue = computed(() => options.sort?.value ?? internalSort.value)
  const filtersValue = computed(() => options.filters?.value ?? internalFilters.value)
  const checkboxValue = computed(() => options.checkbox?.value ?? internalCheckbox.value)

  function setSort(value: [string, SortDirection] | undefined) {
    internalSort.value = value
    options.onSortUpdate(value)
  }

  function setFilters(value: { [key: string]: string }) {
    internalFilters.value = value
    options.onFiltersUpdate(value)
  }

  function setCheckbox(value: T[]) {
    internalCheckbox.value = value
    options.onCheckboxUpdate(value)
  }

  return {
    sortValue,
    filtersValue,
    checkboxValue,
    setSort,
    setFilters,
    setCheckbox,
  }
}
