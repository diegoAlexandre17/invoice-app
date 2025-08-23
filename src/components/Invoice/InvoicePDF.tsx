import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../../public/figma-logo.jpeg";
import type { InvoiceData } from "./types";
import { useTranslation } from "react-i18next";

interface InvoicePDFProps {
  data?: InvoiceData;
}

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

// Función para formatear la fecha actual en formato dd/mm/yyyy


const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const invoiceData = data;

  const { t } = useTranslation();

  // Si no hay datos, no renderizar nada
  if (!invoiceData) {
    return null;
  }

  console.log("Rendering PDF with data:", invoiceData);

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
              {invoiceData?.invoiceNumber && (
                <Text style={styles.invoiceDetails}>
                  <Text style={styles.invoiceDetailLabel}>N°: </Text>
                  {invoiceData.invoiceNumber}
                </Text>
              )}
              <Text style={styles.invoiceDetails}>
                <Text style={styles.invoiceDetailLabel}>
                  {`${t("invoice.date")}: ${invoiceData.date}`}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Información de empresa y cliente */}
        <View style={styles.companyClientContainer}>
          <View style={styles.companySection}>
            <Text style={styles.sectionTitle}>Empresa</Text>
            {invoiceData.company?.name && (
              <Text style={styles.companyName}>{invoiceData.company.name}</Text>
            )}
            {invoiceData.company?.nif && (
              <Text style={styles.companyInfo}>{invoiceData.company.nif}</Text>
            )}
            {invoiceData.company?.address && (
              <Text style={styles.companyInfo}>
                {invoiceData.company.address}
              </Text>
            )}
            {invoiceData.company?.city && (
              <Text style={styles.companyInfo}>{invoiceData.company.city}</Text>
            )}
            {invoiceData.company?.phone && (
              <Text style={styles.companyInfo}>{invoiceData.company.phone}</Text>
            )}
            {invoiceData.company?.email && (
              <Text style={styles.companyInfo}>{invoiceData.company.email}</Text>
            )}
          </View>

          <View style={styles.clientSection}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            {invoiceData.client?.name && (
              <Text style={styles.companyName}>{invoiceData.client.name}</Text>
            )}
            {invoiceData.client?.address && (
              <Text style={styles.companyInfo}>{invoiceData.client.address}</Text>
            )}
            {invoiceData.client?.city && (
              <Text style={styles.companyInfo}>{invoiceData.client.city}</Text>
            )}
            {invoiceData.client?.phone && (
              <Text style={styles.companyInfo}>{invoiceData.client.phone}</Text>
            )}
            {invoiceData.client?.email && (
              <Text style={styles.companyInfo}>{invoiceData.client.email}</Text>
            )}
          </View>
        </View>

        {/* Tabla de productos/servicios */}
        {invoiceData.items && invoiceData.items.length > 0 && (
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
                  <Text style={styles.tableCellText}>
                    {item.unitPrice.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.totalCol}>
                  <Text style={styles.tableCellText}>
                    {item.total.toFixed(2)} €
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Sección de total */}
        {invoiceData.subtotal !== undefined && invoiceData.subtotal !== null && (
          <View style={styles.totalSection}>
            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  {invoiceData.subtotal.toFixed(2)} €
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notas */}
        {invoiceData?.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notas</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default InvoicePDF;
