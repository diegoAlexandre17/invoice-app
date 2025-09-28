import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/general/Loader";
import { Button } from "@/components/ui/button";

// Tipo para los datos de la factura desde la base de datos
interface InvoiceFromDB {
  id: string;
  user_id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_address?: string;
  items: any[];
  notes?: string;
  total_amount: number;
  pdf_path: string;
  created_at: string;
  updated_at: string;
}

const InvoiceDetails = () => {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Query para obtener los detalles de la factura
  const { data: invoiceData, isPending: loadingInvoice } =
    useQuery<InvoiceFromDB | null>({
      queryKey: ["invoice", invoice_id, user?.id],
      queryFn: async () => {
        if (!user || !invoice_id) return null;

        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", invoice_id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching invoice data:", error);
          throw error;
        }

        return data as InvoiceFromDB | null;
      },
      enabled: !!user && !!invoice_id,
    });

  // Query para obtener la URL del PDF
  const { data: pdfUrl, isPending: loadingPdfUrl } = useQuery<string | null>({
    queryKey: ["invoice-pdf", invoiceData?.pdf_path],
    queryFn: async () => {
      if (!invoiceData?.pdf_path) return null;

      try {
        // Obtener URL firmada (signed URL) para el PDF privado
        const { data, error } = await supabase.storage
          .from("invoices")
          .createSignedUrl(invoiceData.pdf_path, 60 * 60); // URL válida por 1 hora

        if (error) {
          console.error("Error getting PDF URL:", error);
          throw error;
        }

        return data.signedUrl;
      } catch (error) {
        console.error("Error creating signed URL:", error);
        return null;
      }
    },
    enabled: !!invoiceData?.pdf_path,
  });

  // Mostrar loader mientras se cargan los datos
  if (loadingInvoice || loadingPdfUrl) {
    return <Loader />;
  }

  // Si no hay datos de la factura
  if (!invoiceData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-600">
          {t("invoice.invoiceNotFound")}
        </h2>
        <Button onClick={() => window.history.back()}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de la factura */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{t("invoice.invoiceDetails")}</h3>

            <div className="flex gap-3">
              <p className="text-gray-600 mt-1">
                <b>{t("customers.customerName")}:</b> {invoiceData.client_name}
              </p>

              <p className="text-gray-600 mt-1">
                <b>{t("invoice.invoiceNumber")}:</b>{" "}
                {invoiceData.invoice_number}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Previsualizador de PDF */}
      {pdfUrl ? (
        <div className="w-full h-[700px] border rounded-lg overflow-hidden bg-white shadow-sm">
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            className="border-0"
            title={`${t("invoice.invoice")} ${invoiceData.invoice_number}`}
          />
        </div>
      ) : (
        <div className="w-full h-[700px] border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600">
              {t("invoice.pdfNotAvailable")}
            </h3>
            <p className="text-gray-500">
              {t("invoice.pdfNotAvailableDescription")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
