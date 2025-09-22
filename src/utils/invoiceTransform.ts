import type { InvoiceData, InvoiceItem, InvoiceFormData } from "../views/invoices/types";

// Función para transformar los datos del formulario al formato InvoiceData
export const transformFormDataToInvoiceData = (
  formData: InvoiceFormData,
  companyData?: any
): InvoiceData => {
  // Calcular el total de cada item
  const items: InvoiceItem[] = formData.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.quantity * item.unitPrice,
  }));

  // Calcular el subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  // Generar número de factura automático (puedes mejorarlo según tus necesidades)
  const currentDate = new Date();
  const invoiceNumber = `FAC-${currentDate.getFullYear()}-${String(
    Date.now()
  ).slice(-6)}`;

  // Formatear fechas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return {
    invoiceNumber,
    date: formatDate(new Date()),
    company: companyData,
    currency: companyData?.currency,
    client: {
      id: formData.id || '',
      name: formData.name,
      address: formData.address || "",
      phone: formData.phone ? `${formData.phone}` : "",
      email: `${formData.email}`,
    },
    items,
    subtotal,
    notes: formData.notes,
  };
};
