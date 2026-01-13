import { computed, type ComputedRef } from 'vue'
import type { DTHeader } from '../types/datatable'

/**
 * Composable for optimized table filtering with memoized normalization
 * @param data - Function returning the data array
 * @param headers - Function returning the headers array
 * @param filters - Function returning the active filters object
 * @param type - Table type ('local' or 'remote')
 */
export function useTableFiltering<T>(
  data: () => T[],
  headers: () => DTHeader[],
  filters: () => Record<string, string>,
  type?: string
) {
  const normalizeString = (str: string): string =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  // Memoize normalized filter values to avoid repeated normalization
  const normalizedFilters = computed(() => {
    const result: Record<string, string> = {}
    Object.entries(filters()).forEach(([key, value]) => {
      if (value?.trim()) {
        result[key] = normalizeString(value)
      }
    })
    return result
  })

  // Only iterate headers that have active filters
  const activeFilterHeaders = computed(() =>
    headers().filter((h) => normalizedFilters.value[h.id])
  )

  const filteredData: ComputedRef<T[]> = computed(() => {
    const rows = data()
    if (type === 'remote') return rows

    const activeFilters = activeFilterHeaders.value
    if (activeFilters.length === 0) return rows

    return rows.filter((row: T) => {
      return activeFilters.every((header) => {
        const value = row[header.id as keyof T]
        if (value == null || typeof (value as any).toString !== 'function') {
          return false
        }

        return normalizeString(String(value)).includes(
          normalizedFilters.value[header.id]
        )
      })
    })
  })

  return { filteredData, normalizedFilters }
}
