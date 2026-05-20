"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountDetail } from "@/types/account";

const TAB_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "background", label: "Background" },
  { id: "activities", label: "Activities" },
  { id: "contacts", label: "Contacts" },
  { id: "products", label: "Products" },
  { id: "quotes", label: "Quotes" },
] as const;

interface AccountDetailTabsProps {
  account: AccountDetail;
}

function PlaceholderSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function AccountDetailTabs({ account }: AccountDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {TAB_SECTIONS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:shadow-none rounded-none bg-transparent px-4 py-2"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="overview">
        <PlaceholderSection
          title="Account Overview"
          description={`Summary and key metrics for ${account.brandName} will appear here.`}
        />
      </TabsContent>
      <TabsContent value="background">
        <PlaceholderSection
          title="Company Background"
          description="Company history, market position, and notes will be managed in this section."
        />
      </TabsContent>
      <TabsContent value="activities">
        <PlaceholderSection
          title="Activities"
          description="Calls, meetings, and follow-ups will be tracked here."
        />
      </TabsContent>
      <TabsContent value="contacts">
        <PlaceholderSection
          title="Contacts"
          description="Key stakeholders and contact details will be listed here."
        />
      </TabsContent>
      <TabsContent value="products">
        <PlaceholderSection
          title="Products"
          description="Product interest and catalog alignment will be shown here."
        />
      </TabsContent>
      <TabsContent value="quotes">
        <PlaceholderSection
          title="Quotes"
          description="Proposals and quote history will be available in this section."
        />
      </TabsContent>
    </Tabs>
  );
}
