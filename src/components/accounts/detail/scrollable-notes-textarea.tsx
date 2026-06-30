"use client";

import { useLayoutEffect, useRef } from "react";
import { useViewportNotesMaxHeight } from "@/hooks/use-viewport-notes-max-height";
import { INPUT_LIMITS } from "@/lib/sanitize";

interface ScrollableNotesTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const MIN_HEIGHT_PX = 120;

export function ScrollableNotesTextarea({
  id,
  value,
  onChange,
  placeholder,
  maxLength = INPUT_LIMITS.longText,
}: ScrollableNotesTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportMaxHeight = useViewportNotesMaxHeight();

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const contentHeight = el.scrollHeight;
    const nextHeight = Math.min(Math.max(contentHeight, MIN_HEIGHT_PX), viewportMaxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = contentHeight > viewportMaxHeight ? "auto" : "hidden";
  }, [value, viewportMaxHeight]);

  return (
    <div className="space-y-1">
      <textarea
        ref={textareaRef}
        id={id}
        className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ maxHeight: viewportMaxHeight, minHeight: MIN_HEIGHT_PX }}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-right text-xs text-muted-foreground tabular-nums">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()}
      </p>
    </div>
  );
}
