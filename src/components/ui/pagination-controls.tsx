import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  total: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  totalPages,
  total,
  isLoading,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <p>
        Page {page} of {totalPages} · {total} records
        {isLoading ? " · Updating…" : null}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
