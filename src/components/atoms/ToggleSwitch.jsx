export default function ToggleSwitch({ disabled, className, ...props }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" disabled={disabled} {...props} />
      <div className={`relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500 ${className}`}></div>
    </label>
  );
}
