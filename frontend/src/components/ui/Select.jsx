import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, id, children, placeholder, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`form-input ${
          error ? "border-red-500/60 focus:ring-red-500/40 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
