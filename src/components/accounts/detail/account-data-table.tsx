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
}

export function AccountDataTable({
  columns,
  rows,
  emptyMessage = "No records found for this account.",
}: AccountDataTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
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
            <TableRow key={(row.id as string) ?? rowIndex}>
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
