import { fetchAccountsPage } from "@/lib/accounts/accounts-pagination";
import { AccountsPageClient } from "@/components/accounts/accounts-page-client";
import { AccountsErrorState } from "@/components/accounts/accounts-error-state";

export default async function AccountsPage() {
  const response = await fetchAccountsPage({ page: 1 });

  if (response.error || !response.result) {
    return (
      <AccountsErrorState
        message={response.error ?? "Failed to load accounts."}
      />
    );
  }

  return (
    <AccountsPageClient
      initialResult={response.result}
      stages={response.stages}
    />
  );
}
