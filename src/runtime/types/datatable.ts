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
  content: DTContent[];
}

export type SortDirection = "asc" | "desc";

export type DataTableType = "remote" | "local";
