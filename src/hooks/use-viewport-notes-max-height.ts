"use client";

import { useEffect, useState } from "react";

const MIN_HEIGHT_PX = 120;
const MAX_HEIGHT_PX = 480;

/**
 * Viewport-aware max height for Notes textareas.
 * Reserves space for surrounding form chrome on each device size.
 */
export function useViewportNotesMaxHeight() {
  const [maxHeight, setMaxHeight] = useState(MIN_HEIGHT_PX);

  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isCompact = vw < 640;
      const reserved = isCompact ? vh * 0.55 : vh * 0.5;
      const available = vh - reserved;
      setMaxHeight(
        Math.min(Math.max(available, MIN_HEIGHT_PX), MAX_HEIGHT_PX)
      );
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return maxHeight;
}
