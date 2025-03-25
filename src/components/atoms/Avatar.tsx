import { tv } from "tailwind-variants";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AvatarProps {
  src?: string | StaticImport;
  icon?: React.ReactNode;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg";
  failed?: boolean;
  className?: string;
}

const avatar = tv({
  slots: {
    base: "inline-flex items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden font-medium text-white",
    image: "h-full w-full object-cover",
    icon: "text-slate-200 dark:text-slate-800",
  },
  variants: {
    size: {
      xs: {
        base: "w-6 h-6 text-xs",
        icon: "p-1",
      },
      sm: {
        base: "w-8 h-8 text-sm",
        icon: "p-1",
      },
      md: {
        base: "w-12 h-12 text-base",
        icon: "p-2",
      },
      lg: {
        base: "w-16 h-16 text-lg",
        icon: "p-2",
      },
    },
    failed: {
      true: {
        base: "bg-red-200 dark:bg-red-400",
        icon: "text-red-300 dark:text-red-500",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  icon,
  alt,
  failed = false,
  size = "md",
  className,
}) => {
  const initials = getInitials(alt);

  const {
    base: baseClass,
    icon: iconClass,
    image: imageClass,
  } = avatar({ size, failed });

  return (
    <div className={`${baseClass()} ${className}`} aria-label={alt}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className={imageClass()}
        />
      ) : icon ? (
        <div className={iconClass()}>{icon}</div>
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <span className="h-full w-full" />
      )}
    </div>
  );
};
