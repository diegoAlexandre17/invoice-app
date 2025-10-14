import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableProps } from "./types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import NoData from "../general/NoData";
import Loader from "../general/Loader";

export default function DataTable({
  data,
  columns,
  title,
  description,
  actions,
  search = true,
  loading = false,
  searchValue = "",
  onSearchChange,
  currentPage = 1,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
  totalRecords = 0,
}: DataTableProps) {
  const { t } = useTranslation();

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Componente de tarjeta para vista móvil
  const MobileCard = ({ row, index }: { row: any; index: number }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-2">
          {columns.map((column) => {
            // Si es la columna de acciones, no mostrar la etiqueta
            if (column.key === "actions") {
              return (
                <div key={column.key} className="flex justify-end pt-2">
                  {column.render(row, index)}
                </div>
              );
            }
            
            return (
              <div key={column.key} className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0 mr-2">
                  {column.label}:
                </span>
                <div className="text-sm text-right flex-1 min-w-0">
                  {column.render(row, index)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        {(title || description) && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && <h3 className="text-xl font-bold">{title}</h3>}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 md:flex-row md:gap-4 w-full justify-between">
          {search && (
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary" />
              <Input
                placeholder={t("common.search")}
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          {actions && (
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-stretch md:items-center">
              <div className="flex items-center gap-2 w-full md:w-auto">
                {actions}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-8">
            <Loader text={t("common.loading")} />
          </div>
        ) : !loading && data?.length === 0 ? (
          <NoData />
        ) : (
          <>
            {/* Vista de escritorio - Tabla normal */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary text-primary-foreground">
                      {columns.map((column, index) => (
                        <TableHead
                          key={column.key}
                          className={`${column.width ? column.width : ""} text-${
                            column.align || "center"
                          } text-primary-foreground ${
                            index === 0 ? "rounded-tl-md" : ""
                          } ${index === columns.length - 1 ? "rounded-tr-md" : ""}`}
                        >
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((row, index) => (
                      <TableRow key={row.id || index}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={`text-${column.align || "center"}`}
                          >
                            {column.render(row, index)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Vista móvil - Tarjetas */}
            <div className="block md:hidden">
              <div className="space-y-2">
                {data?.map((row, index) => (
                  <MobileCard key={row.id || index} row={row} index={index} />
                ))}
              </div>
            </div>

            {/* Paginación - Solo mostrar si hay paginación disponible */}
            {onPageChange && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                  {t("common.showing")} {data?.length || 0} {t("common.of")} {totalRecords} {t("common.records")}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {t("common.page")} {currentPage}
                  </span>
                  <div className="space-x-2">
                    <Button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={!hasPreviousPage}
                      size="sm"
                      variant="outline"
                      title={t("common.previous")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      size="sm"
                      variant="outline"
                      title={t("common.next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
