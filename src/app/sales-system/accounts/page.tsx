import { getAccounts } from "@/lib/accounts/queries";
import { AccountsPageClient } from "@/components/accounts/accounts-page-client";
import { AccountsErrorState } from "@/components/accounts/accounts-error-state";

export default async function AccountsPage() {
  const result = await getAccounts();

  if (result.error || !result.data) {
    return (
      <AccountsErrorState
        message={result.error ?? "Failed to load accounts."}
      />
    );
  }

  return (
    <AccountsPageClient accounts={result.data} stages={result.stages} />
  );
}
