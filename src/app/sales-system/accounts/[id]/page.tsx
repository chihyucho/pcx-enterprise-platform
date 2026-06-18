import { notFound } from "next/navigation";
import { getAccountById } from "@/lib/accounts/queries";
import { getAccountFormOptions } from "@/lib/accounts/form-options";
import { AccountDetailPage } from "@/components/accounts/detail/account-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const result = await getAccountById(id);
  const options = await getAccountFormOptions();

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <AccountDetailPage
      account={result.data}
      initialTab={tab}
      categories={options.categories}
      stages={options.stages}
    />
  );
}
