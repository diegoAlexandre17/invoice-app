import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { Plus, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomersModal from "./CustomersModal";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const TabActions = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleClose = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </Button>

      <CustomersModal isOpen={isAddDialogOpen} onClose={handleClose} />
    </>
  );
};

const Customers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const {
    data: customers,
    isLoading: loading
  } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user, // Solo ejecutar si hay usuario
  });

  // Componente específico para clientes usando el DataTable genérico

  const columns: Column[] = [
    { key: "name", label: "Nombre", render: (value) => <div>{value}</div> },
    { key: "email", label: "Email", render: (value) => <div>{value || "N/A"}</div> },
    { key: "phone", label: "Teléfono", render: (value) => <div>{value || "N/A"}</div> },
    { key: "id_number", label: "ID", render: (value) => <div>{value || "N/A"}</div> },
    { key: "address", label: "Dirección", render: (value) => <div>{value || "N/A"}</div> },
    {
      key: "created_at",
      label: "Fecha de Registro",
      render: (value) => new Date(value).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      width: "w-[100px]",
      render: (_, row) => (
        <ActionTable
          icon={<SquarePen />}
          onClick={() => console.log("Edit customer:", row)}
          tooltipText={t("common.edit")}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      title="Gestión de Clientes"
      description="Lista completa de clientes registrados"
      actions={<TabActions />}
      loading={loading}
    />
  );
};

export default Customers;
