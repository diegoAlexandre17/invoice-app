import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/Invoice/InvoicePDF";
import { useTranslation } from "react-i18next";
import { transformFormDataToInvoiceData } from "../../utils/invoiceTransform";

interface FormData {
  name: string;
  id?: string;
  email: string;
  phone?: string;
  address?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface InvoiceViewerProps {
  formData: FormData;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ formData }) => {
  const { t } = useTranslation();

  // Transformar los datos del formulario a formato InvoiceData para el PDF
  const invoiceData = transformFormDataToInvoiceData(formData);

  return (
    <div className="space-y-6">
      {/* Visor del PDF */}
      <div className="w-full h-[700px] border rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF data={invoiceData} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default InvoiceViewer;
