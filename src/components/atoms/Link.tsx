import React from "react";
import {
  Link as AriaLink,
  LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/components/utils";

interface LinkProps extends AriaLinkProps {
  variant?: "primary" | "secondary";
}

const styles = tv({
  extend: focusRing,
  base: "hover:underline aria-disabled:no-underline disabled:pointer-events-none disabled:cursor-default forced-colors:disabled:text-[GrayText] transition rounded-xs",
  variants: {
    variant: {
      primary:
        "text-amber-500 dark:text-amber-500 decoration-amber-600/60 hover:decoration-amber-600 dark:decoration-amber-500/60 dark:hover:decoration-amber-500",
      secondary:
        "text-gray-700 dark:text-slate-300 decoration-gray-700/50 hover:decoration-gray-700 dark:decoration-slate-300/70 dark:hover:decoration-slate-300",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Link(props: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        styles({ ...renderProps, className, variant: props.variant }),
      )}
    />
  );
}
