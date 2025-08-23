// Tipos centralizados para la funcionalidad de facturas

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Company {
  name: string;
  id: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  company: Company;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  notes: string | undefined;
}

// Tipo que representa los datos del formulario de factura
export interface InvoiceFormData {
  name: string;
  id?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string | undefined;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}
