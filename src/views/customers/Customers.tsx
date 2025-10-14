import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { FilePlus, Plus, SquarePen, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomersModal from "./CustomersModal";
import { supabase } from "@/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import SweetModal from "@/components/modals/SweetAlert";
import { useNavigate } from "react-router-dom";

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
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const navigate = useNavigate()

  // Aplicar debounce a la búsqueda (300ms de delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Resetear página cuando cambie la búsqueda
  const [actualSearchQuery, setActualSearchQuery] = useState(debouncedSearchQuery);
  
  if (debouncedSearchQuery !== actualSearchQuery) {
    setCurrentPage(1);
    setActualSearchQuery(debouncedSearchQuery);
  }

  const {
    data: customersData,
    isLoading: loading,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers", user?.id, debouncedSearchQuery, currentPage],
    queryFn: async () => {
      if (!user) return { customers: [], totalCount: 0 };

      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("customers")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .range(from, to);

      // Aplicar filtro de búsqueda si existe
      if (debouncedSearchQuery.trim()) {
        query = query.or(
          `name.ilike.%${debouncedSearchQuery}%,email.ilike.%${debouncedSearchQuery}%,phone.ilike.%${debouncedSearchQuery}%,id_number.ilike.%${debouncedSearchQuery}%,address.ilike.%${debouncedSearchQuery}%`
        );
      }

      const { data, error, count } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        customers: data || [],
        totalCount: count || 0
      };
    },
    enabled: !!user, // Solo ejecutar si hay usuario
  });

  // Extraer los datos de la respuesta
  const customers = customersData?.customers || [];
  const totalCount = customersData?.totalCount || 0;

  const { mutate: deleteCustomer } = useMutation({
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

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular si hay página siguiente y anterior
  const hasNextPage = totalCount > currentPage * PAGE_SIZE;
  const hasPreviousPage = currentPage > 1;

  // Componente específico para clientes usando el DataTable genérico

  const columns: Column[] = [
    { key: "name", label: t('customers.customerName'), render: (row) => <div>{row.name}</div> },
    {
      key: "email",
      label: t('common.email'),
      render: (row) => <div>{row.email || "-"}</div>,
    },
    {
      key: "phone",
      label: t('customers.phone'),
      render: (row) => <div>{row.phone || "-"}</div>,
    },
    {
      key: "id_number",
      label: "ID",
      render: (row) => <div>{row.id_number || "-"}</div>,
    },
    {
      key: "address",
      label: t('customers.address'),
      render: (row) => <div>{row.address || "-"}</div>,
    },
    {
      key: "created_at",
      label: t('customers.registerDate'),
      render: (row) => new Date(row.created_at).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: t('common.actions'),
      align: "right",
      width: "w-[100px]",
      render: (row) => (
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

          <ActionTable
            icon={<FilePlus />}
            onClick={() => navigate(`/admin/invoices/create?customer=${row.id_number}`)}
            tooltipText={t("invoice.createInvoice")}
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
      currentPage={currentPage}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      onPageChange={handlePageChange}
      totalRecords={totalCount}
    />
  );
};

export default Customers;
