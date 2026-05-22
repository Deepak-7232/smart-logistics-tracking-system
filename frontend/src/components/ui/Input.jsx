import { forwardRef } from "react";

/**
 * Controlled Input for use with React Hook Form.
 * Pass `error` to show an inline error message.
 */
const Input = forwardRef(function Input(
  { label, error, id, icon: Icon, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg pointer-events-none" />
        )}
        <input
          ref={ref}
          id={id}
          className={`form-input ${Icon ? "pl-10" : ""} ${
            error ? "border-red-500/60 focus:ring-red-500/40 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
