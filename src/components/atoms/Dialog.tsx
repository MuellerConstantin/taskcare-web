import React from "react";
import { DialogProps, Dialog as RACDialog } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function Dialog(props: DialogProps) {
  return (
    <RACDialog
      {...props}
      className={twMerge(
        "relative max-h-[90vh] overflow-auto p-4 outline outline-0 [[data-placement]>&]:p-4",
        props.className,
      )}
    />
  );
}
