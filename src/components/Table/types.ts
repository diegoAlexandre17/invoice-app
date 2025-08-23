// Tipos para las columnas
export interface Column {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: any, index: number) => React.ReactNode;
}

// Props del componente
export interface DataTableProps {
  data: any[] | undefined;
  columns: Column[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  search?: boolean;
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}
