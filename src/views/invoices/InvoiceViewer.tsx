import { PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import InvoicePDF from "@/components/Invoice/InvoicePDF";
import { transformFormDataToInvoiceData } from "../../utils/invoiceTransform";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/general/Loader";
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
}

interface InvoiceViewerProps {
  formData: InvoiceFormData;
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ formData }) => {
  const { user } = useAuth();

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
  };

  // Transformar los datos del formulario a formato InvoiceData para el PDF
  const invoiceData = transformFormDataToInvoiceData(
    formData,
    transformedCompanyData
  );

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
    </div>
  );
};

export default InvoiceViewer;
