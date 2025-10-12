import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { Button } from "@/components/ui/button";
import { FileDown, FileSearch, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/supabase/client";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";

const TabActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate("/admin/invoices/create")} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        {t("invoice.newInvoice")}
      </Button>
    </>
  );
};

const InvoicesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Aplicar debounce a la búsqueda (300ms de delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Función para descargar el PDF
  const handleDownloadPDF = async (row: any) => {
    if (!row.pdf_path) {
      console.error("PDF path not found");
      return;
    }

    try {
      // Obtener URL firmada del PDF desde Supabase Storage
      const { data, error } = await supabase.storage
        .from("invoices")
        .createSignedUrl(row.pdf_path, 60 * 60); // URL válida por 1 hora

      if (error) {
        console.error("Error getting PDF URL:", error);
        return;
      }

      console.log("Signed URL:", data?.signedUrl);

      // Descargar el archivo usando fetch
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();

      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${row.invoice_number || row.id}.pdf`;

      // Agregar el enlace al DOM, hacer clic y removerlo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar la URL del blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const { data: invoices, isLoading: loading } = useQuery({
    queryKey: ["invoices", user?.id, debouncedSearchQuery],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase.from("invoices").select("*").eq("user_id", user.id);

      // Aplicar filtro de búsqueda si existe
      if (debouncedSearchQuery.trim()) {
        query = query.or(
          `invoice_number.ilike.%${debouncedSearchQuery}%,client_name.ilike.%${debouncedSearchQuery}%,client_email.ilike.%${debouncedSearchQuery}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user, // Solo ejecutar si hay usuario
  });

  const columns: Column[] = [
    {
      key: "invoice_number",
      label: t("invoice.invoiceNumber"),
      render: (row) => (
        <div className="font-mono">{row.invoice_number || "-"}</div>
      ),
    },
    {
      key: "client_name",
      label: t("customers.customerName"),
      render: (row) => <div>{row.client_name || "-"}</div>,
    },
    {
      key: "client_email",
      label: t("common.email"),
      render: (row) => <div>{row.client_email || "-"}</div>,
    },
    {
      key: "created_at",
      label: t("customers.registerDate"),
      render: (row) => new Date(row.created_at).toLocaleDateString("es-ES"),
    },
    {
      key: "total_amount",
      label: t("invoice.amount"),
      render: (row) => {
        const currencySymbol = getCurrencySymbol(row?.currency);
        return <div>{currencySymbol}{row.total_amount || 0}</div>;
      },
    },
    {
      key: "actions",
      label: t("common.actions"),
      align: "center",
      width: "w-[100px]",
      render: (row) => (
        <>
          <ActionTable
            icon={<FileSearch />}
            onClick={() => {
              navigate(`/admin/invoices/${row?.id}`);
            }}
            tooltipText={t("invoice.seeInvoice")}
          />
          <ActionTable
            icon={<FileDown />}
            onClick={() => handleDownloadPDF(row)}
            tooltipText={t("common.download")}
          />
        </>
      ),
    },
  ];

  return (
    <DataTable
      data={invoices || []}
      columns={columns}
      title={t("navigation.invoices")}
      actions={<TabActions />}
      loading={loading}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
};

export default InvoicesTable;
