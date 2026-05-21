"use client";

import { AccountTabCrud } from "@/components/accounts/detail/account-tab-crud";

interface ContactsTabProps {
  accountId: string;
  enabled: boolean;
}

export function ContactsTab({ accountId, enabled }: ContactsTabProps) {
  return (
    <div className="space-y-10">
      <AccountTabCrud
        accountId={accountId}
        table="contacts"
        title="Contacts"
        enabled={enabled}
      />
      <AccountTabCrud
        accountId={accountId}
        table="contact_persons"
        title="Contact Persons"
        enabled={enabled}
      />
    </div>
  );
}
