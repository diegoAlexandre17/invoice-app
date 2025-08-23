import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "@/components/Invoice/InvoicePDF";
import { transformFormDataToInvoiceData } from "../../utils/invoiceTransform";
import type { InvoiceFormData } from "./types";

interface InvoiceViewerProps {
  formData: InvoiceFormData;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ formData }) => {
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
