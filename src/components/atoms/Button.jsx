export default function Button({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={`group relative py-2 px-3 text-sm font-medium rounded-md text-white bg-amber-500 focus:outline-amber-500 hover:brightness-110 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
