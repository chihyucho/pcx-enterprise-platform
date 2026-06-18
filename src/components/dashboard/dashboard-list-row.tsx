import Link from "next/link";
import { accountDetailHref } from "@/lib/dashboard/format";

interface DashboardListRowProps {
  title: string;
  meta: string;
  accountId: string | null;
  accountName: string;
  accountTab?: string;
  onTitleClick?: () => void;
  disabled?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function DashboardListRow({
  title,
  meta,
  accountId,
  accountName,
  accountTab,
  onTitleClick,
  disabled,
  leading,
  trailing,
}: DashboardListRowProps) {
  return (
    <li className="px-3 py-2.5 text-sm">
      <div className="flex items-start gap-3">
        {leading}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              className="text-left font-medium hover:underline disabled:opacity-50"
              disabled={disabled || !onTitleClick}
              onClick={onTitleClick}
            >
              {title}
            </button>
            {trailing}
          </div>
          <p className="text-xs text-muted-foreground">{meta}</p>
          {accountId ? (
            <Link
              href={accountDetailHref(accountId, accountTab)}
              className="text-xs text-primary hover:underline"
            >
              {accountName}
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">{accountName}</span>
          )}
        </div>
      </div>
    </li>
  );
}
