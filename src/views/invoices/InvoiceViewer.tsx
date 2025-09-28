import { PDFViewer, pdf } from "@react-pdf/renderer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import InvoicePDF from "@/components/Invoice/InvoicePDF";
import { transformFormDataToInvoiceData } from "../../utils/invoiceTransform";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/general/Loader";
import { Button } from "@/components/ui/button";
import SweetModal from "@/components/modals/SweetAlert";
import type { InvoiceFormData } from "./types";

// Tipo para los datos de la empresa (copiado del componente Company)
interface CompanyData {
  id?: string;
  user_id?: string;
  name: string;
  address: string;
  identification: string;
  phone: string;
  email: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
  currency: string;
}

interface InvoiceViewerProps {
  formData: InvoiceFormData;
  handlePrevious: () => void;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  formData,
  handlePrevious,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Query para obtener los datos de la empresa (misma query del componente Company)
  const { data: companyData, isPending: loadingCompany } =
    useQuery<CompanyData | null>({
      queryKey: ["company", user?.id],
      queryFn: async () => {
        if (!user) return null;

        const { data, error } = await supabase
          .from("company")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching company data:", error);
          throw error;
        }

        return data as CompanyData | null;
      },
      enabled: !!user,
    });

  // Transformar los datos de la empresa al formato requerido para el PDF
  const transformedCompanyData = {
    name: companyData?.name,
    id: companyData?.identification,
    address: companyData?.address,
    phone: companyData?.phone,
    email: companyData?.email,
    logo: companyData?.logo ? companyData.logo : null,
    currency: companyData?.currency,
  };

  // Transformar los datos del formulario a formato InvoiceData para el PDF
  const invoiceData = transformFormDataToInvoiceData(
    formData,
    transformedCompanyData
  );

  // Función para generar y subir PDF a Supabase Storage (bucket privado)
  const generateAndUploadPDF = async (): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    
    // Generar el PDF como blob
    const pdfBlob = await pdf(<InvoicePDF data={invoiceData} />).toBlob();
    
    // Crear un nombre único para el archivo
    const fileName = `${user.id}/invoice-${invoiceData.invoiceNumber}-${Date.now()}.pdf`;
    
    // Subir el PDF a Supabase Storage (bucket privado)
    const { error } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) {
      throw new Error(`Error uploading PDF: ${error.message}`);
    }

    return fileName;
  };

  // Mutación para guardar la factura
  const saveInvoiceMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Generar y subir el PDF a Supabase Storage
      const pdfPath = await generateAndUploadPDF();

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          invoice_number: invoiceData.invoiceNumber,
          client_name: invoiceData.client.name,
          client_email: invoiceData.client.email,
          client_phone: invoiceData.client.phone || null,
          client_address: invoiceData.client.address || null,
          items: invoiceData.items,
          notes: invoiceData.notes || null,
          total_amount: invoiceData.subtotal,
          pdf_path: pdfPath, // Guardar el path del PDF
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de facturas
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });

      // Mostrar mensaje de éxito
      SweetModal(
        "success",
        t("common.success"),
        t("invoice.saveInvoiceSuccess"),
        t("common.Ok")
      );
    },
    onError: (error: any) => {
      console.error("Error saving invoice:", error);

      // Mostrar mensaje de error
      SweetModal(
        "error",
        t("common.error"),
        error.message || "Error inesperado al guardar la factura",
        t("common.Ok")
      );
    },
  });

  const handleSaveInvoice = () => {
    saveInvoiceMutation.mutate();
  };

  // Mostrar loader mientras se cargan los datos de la empresa
  if (loadingCompany) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Visor del PDF */}
      <div className="w-full h-[700px] border rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF data={invoiceData} />
        </PDFViewer>
      </div>

      <div className="flex justify-between">
        {/* Botón atrás */}
        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={handlePrevious} className="px-8 py-2">
            {t("common.back")}
          </Button>
        </div>

        {/* Botón para guardar la factura */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveInvoice}
            disabled={saveInvoiceMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {saveInvoiceMutation.isPending
              ? t("common.saving")
              : t("invoice.saveInvoice")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;