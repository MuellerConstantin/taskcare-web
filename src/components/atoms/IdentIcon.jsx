"use client";

import { useEffect, useRef } from "react";
import * as jdenticon from "jdenticon";

export default function IdentIcon({ value, className, ...props }) {
  const icon = useRef(null);

  useEffect(() => {
    jdenticon.updateSvg(icon.current, value);
  }, [value]);

  return (
    <svg
      data-jdenticon-value={value}
      ref={icon}
      height="auto"
      width="auto"
      className={`relative h-full w-full bg-gray-100 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
}
