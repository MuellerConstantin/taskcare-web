import { Link as RouterLink } from "react-router-dom";

export default function Link({ children, className, ...props }) {
  return (
    <RouterLink
      className={`text-amber-500 hover:brightness-110 hover:underline ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
