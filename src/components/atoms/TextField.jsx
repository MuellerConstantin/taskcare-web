export default function TextField({
  onChange,
  onBlur,
  value,
  error,
  touched,
  className,
  ...props
}) {
  return (
    <>
      <input
        className={`relative bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-300 placeholder-gray-400 border ${
          error && touched
            ? "border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } block w-full px-3 py-2 rounded-md ring-0 focus:ring-0 focus:border-amber-500 focus:outline-none disabled:opacity-50 ${className}`}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}
