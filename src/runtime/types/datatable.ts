export interface DTHeader {
  id: string;
  label: string;
  sortable?: boolean;
  filtering?: boolean;
  thClass?: string;
}

export interface DTContent {
  id: string;
  tdClass?: string;
}

/**
 * SECURITY WARNING: When using custom cell slots, ensure you sanitize
 * user-generated content before rendering with v-html or similar directives.
 * The default rendering auto-escapes content, but custom slots bypass this.
 */
export interface DTInfo<T> {
  headers: DTHeader[];
  data: T[];
  content?: DTContent[];
}

export interface FiltersConfig {
  class?: string;
}

export interface PaginationConfig {
  itemsPerPage?: number;
  currentPage?: number;
  nbItems?: number;
  paginationClass: string;
  previousButtonClass: string;
  nextButtonClass: string;
}

export interface CheckboxConfig<T = any> {
  overFilterMode?: CheckboxOverFilterMode;
  class?: string;
  /**
   * Key to use for checkbox equality comparison (fixes reference equality issues with remote data)
   * @example idKey: 'id'
   */
  idKey?: keyof T;
}

export type SortDirection = "asc" | "desc";

export type DTType = "remote" | "local";

export type CheckboxOverFilterMode = "delete" | "keep";

export interface SortingIconSlotProps {
  direction: SortDirection | null;
  headerId: string;
}

export interface CheckboxHeaderSlotProps {
  checked: boolean;
  toggleCheckbox: () => void;
}

export interface CheckboxCellSlotProps<T> {
  row: T;
  checked: boolean;
  toggleCheckbox: () => void;
}

export interface PaginationSlotProps {
  currentPage: number;
  maxPage: number;
  changePage: (page: number) => void;
}

export interface HeaderSlotProps extends DTHeader {
  sortId: string | null;
  sortDirection: SortDirection | null;
  toggleSort: () => void;
  setFilter: (value: string) => void;
}
