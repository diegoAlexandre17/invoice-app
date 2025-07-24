import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import type { Column } from "@/components/Table/types";
import { Plus, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomersModal from "./CustomersModal";

const TabActions = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Cliente
      </Button>

      <CustomersModal isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </>
  );
};

const Customers = () => {
  const { t } = useTranslation();

  // Ejemplo de uso para usuarios (puedes mover esto a un archivo separado)
  const users = [
    {
      id: "1",
      name: "Ana García",
      email: "ana.garcia@email.com",
      role: "Admin",
      status: "Activo",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos.lopez@email.com",
      role: "Editor",
      status: "Activo",
      joinDate: "2024-02-20",
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria.rodriguez@email.com",
      role: "Viewer",
      status: "Inactivo",
      joinDate: "2024-01-08",
    },
    {
      id: "4",
      name: "Juan Martínez",
      email: "juan.martinez@email.com",
      role: "Editor",
      status: "Activo",
      joinDate: "2024-03-10",
    },
    {
      id: "5",
      name: "Laura Sánchez",
      email: "laura.sanchez@email.com",
      role: "Admin",
      status: "Activo",
      joinDate: "2024-02-05",
    },
  ];

  // Componente específico para usuarios usando el DataTable genérico

  const columns: Column[] = [
    { key: "name", label: "Nombre", render: (value) => <div>{value}</div> },
    { key: "email", label: "Email", render: (value) => <div>{value}</div> },
    { key: "role", label: "Rol", render: (value) => <div>{value}</div> },
    { key: "status", label: "Estado", render: (value) => <div>{value}</div> },
    {
      key: "joinDate",
      label: "Fecha de Registro",
      render: (value) => new Date(value).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "Acciones",
      align: "right",
      width: "w-[100px]",
      render: (value, row) => (
        <ActionTable
          icon={<SquarePen />}
          onClick={() => console.log("actions")}
          tooltipText={t("common.edit")}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      title="Gestión de Usuarios"
      // description="Lista completa de usuarios registrados en el sistema"
      actions={<TabActions />}
    />
  );
};

export default Customers;
