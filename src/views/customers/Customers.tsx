import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { Plus, SquarePen, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomersModal from "./CustomersModal";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import SweetModal from "@/components/modals/SweetAlert";

const TabActions = ({
  isModalOpen,
  setIsModalOpen,
  editingCustomer,
  setEditingCustomer,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingCustomer: any;
  setEditingCustomer: (customer: any) => void;
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        {t("customers.addCustomer")}
      </Button>

      <CustomersModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editingCustomer={editingCustomer}
      />
    </>
  );
};

const Customers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Aplicar debounce a la búsqueda (300ms de delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: customers,
    isLoading: loading,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", user?.id, debouncedSearchQuery],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase.from("customers").select("*").eq("user_id", user.id);

      // Aplicar filtro de búsqueda si existe
      if (debouncedSearchQuery.trim()) {
        query = query.or(
          `name.ilike.%${debouncedSearchQuery}%,email.ilike.%${debouncedSearchQuery}%,phone.ilike.%${debouncedSearchQuery}%,id_number.ilike.%${debouncedSearchQuery}%,address.ilike.%${debouncedSearchQuery}%`
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

  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
    mutationFn: async (customerId: string) => {
      const { data, error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidar y refrescar la lista de customers
      refetchCustomers();

      // Mostrar mensaje de éxito
      SweetModal(
        "success",
        t("common.success"),
        t("customers.deleteCustomerSuccess"),
        t("common.Ok")
      );
    },
  });

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id: string) => {
    SweetModal(
      "warning",
      t("common.warning"),
      t("customers.deleteCustomerConfirm"),
      t("common.delete"),
      (result) => {
        if (result?.isConfirmed) {
          deleteCustomer(id);
        }
      },
      { showCancelButton: true, cancelButtonText: t('common.cancel') }
    );
  };

  // Componente específico para clientes usando el DataTable genérico

  const columns: Column[] = [
    { key: "name", label: t('customers.customerName'), render: (value) => <div>{value}</div> },
    {
      key: "email",
      label: t('common.email'),
      render: (value) => <div>{value || "-"}</div>,
    },
    {
      key: "phone",
      label: t('customers.phone'),
      render: (value) => <div>{value || "-"}</div>,
    },
    {
      key: "id_number",
      label: "ID",
      render: (value) => <div>{value || "-"}</div>,
    },
    {
      key: "address",
      label: t('customers.address'),
      render: (value) => <div>{value || "-"}</div>,
    },
    {
      key: "created_at",
      label: t('customers.registerDate'),
      render: (value) => new Date(value).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: t('common.actions'),
      align: "right",
      width: "w-[100px]",
      render: (_, row) => (
        <>
          <ActionTable
            icon={<SquarePen />}
            onClick={() => handleEditCustomer(row)}
            tooltipText={t("common.edit")}

          />
          <ActionTable
            icon={<Trash />}
            onClick={() => handleDeleteCustomer(row.id)}
            tooltipText={t("common.delete")}
          />
        </>
      ),
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      title={t("customers.customersTitle")}
      actions={
        <TabActions
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          editingCustomer={editingCustomer}
          setEditingCustomer={setEditingCustomer}
        />
      }
      loading={loading}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
};

export default Customers;
