import type { InvoiceData, InvoiceItem } from '../components/Invoice/types';
import type { InvoiceFormData } from '../views/invoices/types';

// Función para transformar los datos del formulario al formato InvoiceData
export const transformFormDataToInvoiceData = (formData: InvoiceFormData, companyData?: any): InvoiceData => {
  // Calcular el total de cada item
  const items: InvoiceItem[] = formData.items.map(item => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.quantity * item.unitPrice
  }));

  // Calcular el subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  // Generar número de factura automático (puedes mejorarlo según tus necesidades)
  const currentDate = new Date();
  const invoiceNumber = `FAC-${currentDate.getFullYear()}-${String(Date.now()).slice(-6)}`;

  // Formatear fechas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30); // 30 días para vencimiento

  return {
    invoiceNumber,
    date: formatDate(today),
    dueDate: formatDate(dueDate),
    company: companyData || {
      name: "Tu Empresa S.A.",
      nif: "NIF/CIF: B-00000000",
      address: "Tu Dirección",
      city: "Tu Ciudad, 00000",
      phone: "Tel: +34 000 000 000",
      email: "Email: tu@empresa.com"
    },
    client: {
      name: formData.name,
      address: formData.address || "",
      city: "", // Podrías separar ciudad de dirección si es necesario
      phone: formData.phone ? `Tel: ${formData.phone}` : "",
      email: `Email: ${formData.email}`
    },
    items,
    subtotal,
    notes: formData.notes || "Gracias por su confianza. El pago debe realizarse por transferencia bancaria en un plazo de 30 días. Indique el número de factura en el concepto."
  };
};
