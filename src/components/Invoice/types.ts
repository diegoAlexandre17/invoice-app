export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Company {
  name: string;
  nif: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface Client {
  name: string;
  address: string;
  city: string;
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
