import { Building2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountsEmptyState() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md border bg-muted/50">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardTitle className="text-base">No accounts yet</CardTitle>
        <CardDescription>
          Create your first account to start building your sales pipeline.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
