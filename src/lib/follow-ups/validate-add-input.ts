export type FollowUpAddValidationResult =
  | { action: "noop" }
  | { action: "error"; message: string }
  | { action: "add" };

/** Validates the inline “add follow-up” fields (not saved drafts). */
export function getFollowUpAddValidation(input: {
  dueDate: string;
  assignedUserId?: string;
  notes: string;
}): FollowUpAddValidationResult {
  const trimmedNotes = input.notes.trim();
  const hasDueDate = Boolean(input.dueDate.trim());
  const hasAssignee = Boolean(input.assignedUserId);
  const hasNotes = trimmedNotes.length > 0;

  if (!hasDueDate && !hasAssignee && !hasNotes) {
    return { action: "noop" };
  }

  if (hasNotes && !hasDueDate) {
    return {
      action: "error",
      message: "Due date is required when follow-up notes are provided.",
    };
  }

  if (!hasDueDate || !hasAssignee) {
    return {
      action: "error",
      message: "Due date and assignee are required to add a follow-up.",
    };
  }

  return { action: "add" };
}
