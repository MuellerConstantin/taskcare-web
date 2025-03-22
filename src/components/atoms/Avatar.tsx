import { tv } from "tailwind-variants";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AvatarProps {
  src?: string | StaticImport;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const avatar = tv({
  base: "inline-flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden font-medium text-white",
  variants: {
    size: {
      xs: "w-6 h-6 text-xs",
      sm: "w-8 h-8 text-sm",
      md: "w-12 h-12 text-base",
      lg: "w-16 h-16 text-lg",
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

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = "md" }) => {
  const initials = getInitials(alt);

  return (
    <div className={avatar({ size })} role="img" aria-label={alt}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <span className="h-full w-full bg-gray-400" />
      )}
    </div>
  );
};
