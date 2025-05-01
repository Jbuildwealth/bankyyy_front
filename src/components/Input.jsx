// src/components/Input.jsx
import React from 'react';

// Added id, label, maxLength, pattern, inputMode props
const Input = React.forwardRef(({
    type = "text",
    value,
    onChange,
    placeholder,
    className = '',
    id, // Added id for label association
    label, // Optional label text
    maxLength, // Added maxLength
    pattern, // Added pattern (for regex validation)
    inputMode, // Added inputMode (e.g., 'numeric')
    ...props // Capture rest like required, disabled, name etc.
}, ref) => { // Added ref forwarding

    const baseClasses = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        // Optional: Wrap in div if label is provided
        label ? (
            <div className="w-full">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    type={type}
                    id={id}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${baseClasses} ${className}`}
                    maxLength={maxLength} // Apply maxLength
                    pattern={pattern}     // Apply pattern
                    inputMode={inputMode} // Apply inputMode
                    {...props}
                />
            </div>
        ) : (
            <input
                type={type}
                id={id}
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${baseClasses} ${className}`}
                maxLength={maxLength}
                pattern={pattern}
                inputMode={inputMode}
                {...props}
            />
        )
    );
});

Input.displayName = "Input"; // Good practice for forwardRef

export default Input;