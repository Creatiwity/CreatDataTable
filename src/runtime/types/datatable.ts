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

export interface CheckboxConfig {
  overFilterMode?: CheckboxOverFilterMode;
  class?: string;
}

export type SortDirection = "asc" | "desc";

export type DTType = "remote" | "local";

export type CheckboxOverFilterMode = "delete" | "keep";
