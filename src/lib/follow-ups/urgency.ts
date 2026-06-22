export type FollowUpUrgency = "completed" | "due-soon" | "due-urgent" | "default";

/** Whole days from today until due date (negative = overdue). */
export function daysUntilDue(dueDate: string): number {
  const due = startOfLocalDay(new Date(dueDate));
  const today = startOfLocalDay(new Date());
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

function startOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getFollowUpUrgency(
  dueDate: string,
  completedAt?: string | null
): FollowUpUrgency {
  if (completedAt) {
    return "completed";
  }

  const days = daysUntilDue(dueDate);

  if (days <= 3) {
    return "due-urgent";
  }

  if (days <= 7) {
    return "due-soon";
  }

  return "default";
}

export function followUpItemBackgroundClass(
  urgency: FollowUpUrgency
): string {
  switch (urgency) {
    case "completed":
      return "bg-green-100 dark:bg-green-950/50";
    case "due-urgent":
      return "bg-red-100 dark:bg-red-950/50";
    case "due-soon":
      return "bg-yellow-100 dark:bg-yellow-950/50";
    default:
      return "bg-background";
  }
}
