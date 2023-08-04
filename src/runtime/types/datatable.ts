export interface DTHeader {
  id: string;
  label: string;
  sortable?: boolean;
}

export interface DTInfo<T> {
  headers: DTHeader[];
  data: T[];
}

export type SortDirection = "asc" | "desc";
