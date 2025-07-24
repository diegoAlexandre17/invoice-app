// Tipos para las columnas
export interface Column {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render: (value: any, row: any) => React.ReactNode;
}

// Props del componente
export interface DataTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  search?: boolean;
}
