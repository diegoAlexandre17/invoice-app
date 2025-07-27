import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { Plus, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CustomersModal from "./CustomersModal";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  id_number: string;
  address: string;
  created_at: string;
}

const TabActions = ({ onCustomerAdded }: { onCustomerAdded: () => void }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleClose = () => {
    setIsAddDialogOpen(false);
    onCustomerAdded(); // Refrescar la lista cuando se cierre el modal
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customers:", error);
        return;
      }

      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

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

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  return (
    <DataTable
      data={customers}
      columns={columns}
      title="Gestión de Clientes"
      description="Lista completa de clientes registrados"
      actions={<TabActions onCustomerAdded={fetchCustomers} />}
    />
  );
};

export default Customers;
