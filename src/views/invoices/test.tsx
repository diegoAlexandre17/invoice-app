import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../../public/figma-logo.jpeg";

const data = [
  {
    id: 1,
    description: "Construccion de un muro de 12.00m x 1.00m x 0.20 cm",
    quantity: 2,
    price_unit: 1200,
    total: 5000,
  },
  {
    id: 2,
    description: "Construccion estacionamiento 12.00m",
    quantity: 1,
    price_unit: 1200,
    total: 1200,
  },
  {
    id: 3,
    description: "Pintura de toda una habitación 12.00m",
    quantity: 1,
    price_unit: 200,
    total: 200,
  },
  {
    id: 4,
    description: "Pintura de toda una cocina 12.00m",
    quantity: 1,
    price_unit: 250,
    total: 250,
  },
  {
    id: 5,
    description: "Relleno de piedras en pared",
    quantity: 1,
    price_unit: 250,
    total: 250,
  },
  {
    id: 6,
    description: "Relleno de piedras en pared",
    quantity: 1,
    price_unit: 250,
    total: 250,
  },
  {
    id: 7,
    description: "Pintura de toda una habitación 12.00m",
    quantity: 1,
    price_unit: 200,
    total: 200,
  },
  {
    id: 8,
    description: "Horas de maquina excavadoré",
    quantity: 3,
    price_unit: 50,
    total: 500,
  },
];

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontSize: "10px",
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: "20px",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceNumber:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: "10px",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    marginTop: "5px",
    padding: "10px",
  },
  table: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  cell: {
    width: "20%",
    textAlign: "center",
    color: "#222",
  },
  tableHeader: {
    width: "20%",
    textAlign: "center",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  subtotal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: "80px",
  },
  signatureContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1px solid #ccc",
    padding: "30px",
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <View>
            <Image src={Logo} style={styles.logo} />
          </View>
          <View>
            <Text>Nombre de la empresa</Text>
            <Text>Direccion empresa</Text>
            <Text>ID empresa</Text>
            <Text>Telefono</Text>
            <Text>Email</Text>
            <Text>Fecha</Text>
          </View>
        </View>

        <View>
          <View>
            <Text>Nombre del cliente</Text>
            <Text>Direccion cliente</Text>
            <Text>ID cliente</Text>
            <Text>Telefono</Text>
            <Text>Email</Text>
          </View>
        </View>
      </View>

      <View style={styles.invoiceNumber}>
        <Text>Numero de factura</Text>
      </View>


      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.tableHeader}>
            <Text>Description</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text>Quantité</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text>Prix unitaire</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text>Total</Text>
          </View>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.cell}>
              <Text>{item.description}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.quantity}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.price_unit}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{item.total}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.subtotal}>
        <Text>Total </Text>

        <Text>57.000 EUR</Text>
      </View>

      <View>
        <Text>Notas:</Text>
        <Text>
          Se recomienda el pago dentro de los 30 días posteriores a la fecha de
          la factura.
        </Text>
      </View>

      <View style={styles.signatureContainer}>
        <View>
          <Text>Signature entreprise</Text>
        </View>

        <View>
          <Text>Signature entreprise</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
