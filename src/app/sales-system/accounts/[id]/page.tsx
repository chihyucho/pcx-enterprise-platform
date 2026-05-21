import { notFound } from "next/navigation";
import { getAccountById } from "@/lib/accounts/queries";
import { AccountDetailPage } from "@/components/accounts/detail/account-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const result = await getAccountById(id);

  if (result.error || !result.data) {
    notFound();
  }

  return <AccountDetailPage account={result.data} />;
}
