export interface DTHeader {
  id: string;
  label: string;
  sortable?: boolean;
  filtering?: boolean;
}

export interface DTInfo<T> {
  headers: DTHeader[];
  data: T[];
}

export type SortDirection = "asc" | "desc";

export type FilterType = "remote" | "local";
