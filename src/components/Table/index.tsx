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
import { useTranslation } from "@/hooks/useTranslation";
import { Search } from "lucide-react";
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
}: DataTableProps) {
  const { t } = useTranslation();

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

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

          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8">
                  <Loader text={t("common.loading")} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : !loading && data?.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <NoData />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
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
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
