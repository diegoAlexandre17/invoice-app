import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../../public/figma-logo.jpeg";
import type { InvoiceData } from './types';


interface InvoicePDFProps {
  data?: InvoiceData;
}

// Datos de ejemplo basados en la imagen
const defaultInvoiceData: InvoiceData = {
  invoiceNumber: "FAC-2025-001",
  date: "07/08/2025",
  dueDate: "22/08/2025",
  company: {
    name: "Acme S.A.",
    nif: "NIF/CIF: B-12345678",
    address: "Calle Falsa 123",
    city: "Madrid, 28001",
    phone: "Tel: +34 600 000 000",
    email: "Email: facturacion@acme.com"
  },
  client: {
    name: "Cliente de Ejemplo",
    address: "Avenida Principal 456",
    city: "Barcelona, 08001",
    phone: "Tel: +34 611 111 111",
    email: "Email: cliente@ejemplo.com"
  },
  items: [
    {
      description: "Servicio de consultoría",
      quantity: 10,
      unitPrice: 75.00,
      total: 750.00
    },
    {
      description: "Diseño de interfaz",
      quantity: 5,
      unitPrice: 95.00,
      total: 475.00
    },
    {
      description: "Mantenimiento mensual",
      quantity: 1,
      unitPrice: 120.00,
      total: 120.00
    }
  ],
  subtotal: 1345.00,
  notes: "Gracias por su confianza. El pago debe realizarse por transferencia bancaria en un plazo de 15 días. Indique el número de factura en el concepto."
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontSize: 10,
    paddingHorizontal: 40,
    paddingVertical: 50,
    fontFamily: "Helvetica",
  },
  
  // Header styles
  header: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  titleContainer: {
    marginBottom: 20,
  },
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  
  invoiceDetails: {
    fontSize: 10,
    color: "#666",
  },
  
  invoiceDetailLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  
  // Company and client info
  companyClientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 40,
  },
  
  companySection: {
    flex: 1,
    paddingRight: 20,
  },
  
  clientSection: {
    flex: 1,
    paddingLeft: 20,
  },
  
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  
  companyInfo: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.4,
  },
  
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  
  logo: {
    width: 60,
    height: 60,
    marginBottom: 15,
    borderRadius: 5,
    objectFit: "cover",
  },
  
  // Table styles
  table: {
    marginBottom: 20,
  },
  
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#dee2e6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 35,
  },
  
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  
  tableCellText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
  
  descriptionCol: {
    width: "40%",
    paddingRight: 10,
  },
  
  quantityCol: {
    width: "15%",
  },
  
  priceCol: {
    width: "20%",
  },
  
  totalCol: {
    width: "25%",
  },
  
  descriptionText: {
    textAlign: "left",
  },
  
  // Total section
  totalSection: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  
  totalContainer: {
    width: 200,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  
  // Notes section
  notesSection: {
    marginTop: 30,
  },
  
  notesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  
  notesText: {
    fontSize: 10,
    color: "#666",
    lineHeight: 1.4,
    textAlign: "justify",
  },
});

const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const invoiceData = data || defaultInvoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y título */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image src={Logo} style={styles.logo} />
          </View>
          
          <View style={styles.invoiceInfo}>
            <View>
              <Text style={styles.invoiceDetails}>
                <Text style={styles.invoiceDetailLabel}>N°: </Text>
                {invoiceData.invoiceNumber}
              </Text>
              <Text style={styles.invoiceDetails}>
                <Text style={styles.invoiceDetailLabel}>Fecha: </Text>
                {invoiceData.date}
              </Text>
              <Text style={styles.invoiceDetails}>
                <Text style={styles.invoiceDetailLabel}>Vencimiento: </Text>
                {invoiceData.dueDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Información de empresa y cliente */}
        <View style={styles.companyClientContainer}>
          <View style={styles.companySection}>
            <Text style={styles.sectionTitle}>Empresa</Text>
            <Text style={styles.companyName}>{invoiceData.company.name}</Text>
            <Text style={styles.companyInfo}>{invoiceData.company.nif}</Text>
            <Text style={styles.companyInfo}>{invoiceData.company.address}</Text>
            <Text style={styles.companyInfo}>{invoiceData.company.city}</Text>
            <Text style={styles.companyInfo}>{invoiceData.company.phone}</Text>
            <Text style={styles.companyInfo}>{invoiceData.company.email}</Text>
          </View>
          
          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <Text style={styles.companyName}>{invoiceData.client.name}</Text>
            <Text style={styles.companyInfo}>{invoiceData.client.address}</Text>
            <Text style={styles.companyInfo}>{invoiceData.client.city}</Text>
            <Text style={styles.companyInfo}>{invoiceData.client.phone}</Text>
            <Text style={styles.companyInfo}>{invoiceData.client.email}</Text>
          </View>
        </View>

        {/* Tabla de productos/servicios */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableHeader}>
            <View style={styles.descriptionCol}>
              <Text style={styles.tableHeaderText}>Descripción</Text>
            </View>
            <View style={styles.quantityCol}>
              <Text style={styles.tableHeaderText}>Cantidad</Text>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.tableHeaderText}>Precio unitario</Text>
            </View>
            <View style={styles.totalCol}>
              <Text style={styles.tableHeaderText}>Total</Text>
            </View>
          </View>
          
          {/* Filas de la tabla */}
          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.descriptionCol}>
                <Text style={[styles.tableCellText, styles.descriptionText]}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.quantityCol}>
                <Text style={styles.tableCellText}>{item.quantity}</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.tableCellText}>{item.unitPrice.toFixed(2)} €</Text>
              </View>
              <View style={styles.totalCol}>
                <Text style={styles.tableCellText}>{item.total.toFixed(2)} €</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sección de total */}
        <View style={styles.totalSection}>
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{invoiceData.subtotal.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        {/* Notas */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notas</Text>
          <Text style={styles.notesText}>{invoiceData.notes}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
