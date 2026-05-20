"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  formatSourceLabel,
  stageBadgeVariant,
} from "@/lib/accounts/format";
import type { AccountListItem } from "@/types/account";

interface AccountsTableProps {
  accounts: AccountListItem[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No accounts match your filters.
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/sales-system/accounts/${account.id}`}
                    className="hover:underline"
                  >
                    {account.brandName}
                  </Link>
                </TableCell>
                <TableCell>{account.categoryName}</TableCell>
                <TableCell>
                  <Badge variant={stageBadgeVariant(account.stageName)}>
                    {account.stageName}
                  </Badge>
                </TableCell>
                <TableCell>{formatSourceLabel(account.source)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {account.createdAt}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
