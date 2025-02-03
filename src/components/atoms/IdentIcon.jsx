"use client";

import { useEffect, useRef } from "react";
import * as jdenticon from "jdenticon";

export default function IdentIcon({ value, className, ...props }) {
  const icon = useRef(null);

  useEffect(() => {
    jdenticon.updateSvg(icon.current, value);
  }, [value]);

  return (
    <div className={`w-32 h-32 bg-gray-100 dark:bg-gray-800 ${className}`} {...props}>
      <svg data-jdenticon-value={value} ref={icon} width="100%" height="auto" viewBox="0 0 100 100" />
    </div>
  );
}
