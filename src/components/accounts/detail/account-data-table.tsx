"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCellValue, isUrlColumn } from "@/lib/accounts/format-cell";
import type { TabColumnDef } from "@/lib/schema/tab-columns";

interface AccountDataTableProps {
  columns: TabColumnDef[];
  rows: Record<string, unknown>[];
  emptyMessage?: string;
  vertical?: boolean;
  verticalLabelClassName?: string;
  verticalValueClassName?: string;
  multilineKeys?: string[];
  onRowClick?: (row: Record<string, unknown>) => void;
}

export function AccountDataTable({
  columns,
  rows,
  emptyMessage = "No records found for this account.",
  vertical = false,
  verticalLabelClassName = "w-[min(14rem,35%)]",
  verticalValueClassName = "",
  multilineKeys = ["notes"],
  onRowClick,
}: AccountDataTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  if (vertical) {
    return (
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={(row.id as string) ?? rowIndex}
            className="overflow-hidden rounded-lg border bg-card"
          >
            <Table className="table-fixed w-full">
              <TableBody>
                {columns.map((col) => {
                  const value = row[col.key];
                  const display = formatCellValue(col.key, value);
                  const isMultiline = multilineKeys.includes(col.key);

                  return (
                    <TableRow key={col.key}>
                      <TableCell
                        className={`${verticalLabelClassName} shrink-0 align-top py-3 pl-4 pr-3 text-sm font-medium text-muted-foreground`}
                      >
                        {col.label}
                      </TableCell>
                      <TableCell
                        className={`${verticalValueClassName} min-w-0 align-top py-3 pr-4 text-sm ${
                          isMultiline ? "whitespace-pre-wrap break-words" : "break-words"
                        }`}
                      >
                        {isUrlColumn(col.key) &&
                        typeof value === "string" &&
                        value.length > 0 ? (
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {display === "—" ? value : "View link"}
                          </a>
                        ) : (
                          display
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={(row.id as string) ?? rowIndex}
              className={
                onRowClick
                  ? "cursor-pointer transition-colors hover:bg-muted/50"
                  : undefined
              }
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => {
                const value = row[col.key];
                const display = formatCellValue(col.key, value);

                if (
                  isUrlColumn(col.key) &&
                  typeof value === "string" &&
                  value.length > 0
                ) {
                  return (
                    <TableCell key={col.key}>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {display === "—" ? value : "View link"}
                      </a>
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={col.key}
                    className={
                      col.key === "notes" ? "max-w-xs truncate" : undefined
                    }
                    title={
                      col.key === "notes" && typeof value === "string"
                        ? value
                        : undefined
                    }
                  >
                    {display}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
