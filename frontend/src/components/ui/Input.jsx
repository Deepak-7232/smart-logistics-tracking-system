import { forwardRef } from "react";
import { clsx } from "clsx";

const Input = forwardRef(function Input(
  { label, id, error, icon: Icon, className = "", ...props },
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
            <Icon className="text-base" />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "form-input",
            Icon && "pl-9",
            error && "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
});

export default Input;
