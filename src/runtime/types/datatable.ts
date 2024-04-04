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

export interface DTInfo {
  headers: DTHeader[];
  data: DTData[];
  content: DTContent[];
}

export interface DTData {
  [key: string]: any;
}

export interface FiltersConfig {
  class?: string;
}

export interface PaginationConfig {
  itemsPerPage?: number;
}

export interface CheckboxConfig {
  id: string;
  overFilterMode?: CheckboxOverFilterMode;
  class?: string;
}

export type SortDirection = "asc" | "desc";

export type DTType = "remote" | "local";

export type CheckboxOverFilterMode = "delete" | "keep";
