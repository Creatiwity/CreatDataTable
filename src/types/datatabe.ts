export interface DTHeader {
  id: string;
  label: string;
}

export interface DTInfo<T> {
  headers: DTHeader[];
  data: T[];
}
