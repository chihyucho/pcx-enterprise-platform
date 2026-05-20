import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Sales pipeline overview and key metrics.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Active Accounts", "Open Quotes", "Activities This Week"].map(
          (metric) => (
            <Card key={metric}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">—</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
