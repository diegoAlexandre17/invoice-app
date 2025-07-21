import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableProps } from "./types";

export default function DataTable({
  data,
  columns,
  caption,
  title,
  description,
}: DataTableProps) {
  return (
    <div className="container mx-auto py-8">
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          {caption && (
            <TableCaption>
              {caption} {data.length > 0 && `Total: ${data.length} registros.`}
            </TableCaption>
          )}
          <TableHeader>
            <TableRow className="bg-primary text-primary-foreground">
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={`${column.width ? column.width : ""} text-${column.align || "center"} text-primary-foreground ${
                    index === 0 ? "rounded-tl-md" : ""
                  } ${
                    index === columns.length - 1 ? "rounded-tr-md" : ""
                  }`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`text-${column.align || "center"}`}
                  >
                    {column.render(row[column.key], row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
