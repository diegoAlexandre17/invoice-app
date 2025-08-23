import DataTable from "@/components/Table";
import { ActionTable } from "@/components/Table/ActionTable";
import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const TabActions = () => {
  const { t } = useTranslation();

  return (
    <>
      <Button onClick={() => {}} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        {t("invoice.newInvoice")}
      </Button>
    </>
  );
};

const InvoicesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value) => <div>{value || "-"}</div>,
    },
    {
      key: "customer",
      label: t("customers.customerName"),
      render: (value) => <div>{value}</div>,
    },
    {
      key: "created_at",
      label: t("customers.registerDate"),
      render: (value) => new Date(value).toLocaleDateString("es-ES"),
    },
    {
      key: "amount",
      label: t("invoice.amount"),
      render: (value) => <div>{value}</div>,
    },
    {
      key: "actions",
      label: t("common.actions"),
      align: "right",
      width: "w-[100px]",
      render: () => (
        <>
          <ActionTable
            icon={<FileDown />}
            onClick={() => {}}
            tooltipText={t("common.download")}
          />
        </>
      ),
    },
  ];

  const invoices = [
    {
      id: 1,
      customer: "John Doe",
      amount: 100,
      status: "paid",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: 200,
      status: "pending",
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <DataTable
      data={invoices}
      columns={columns}
      title={t("navigation.invoices")}
      actions={<TabActions />}
      loading={false}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
};

export default InvoicesTable;
