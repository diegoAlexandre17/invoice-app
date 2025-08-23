// Tipos centralizados para la funcionalidad de facturas

// Tipo que representa los datos del formulario de factura
export interface InvoiceFormData {
  name: string;
  id?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}
