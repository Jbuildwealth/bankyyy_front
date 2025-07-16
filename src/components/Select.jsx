        // src/components/Select.jsx
        import React from 'react';

        const Select = ({ value, onChange, children, className = '', ...props }) => {
          return (
            <select
              value={value}
              onChange={onChange}
              // Define base styles for the select dropdown using Tailwind
              className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
              {...props} // Spread other props like 'required', 'disabled', 'id'
            >
              {children} {/* Render the <option> elements passed as children */}
            </select>
          );
        };

        export default Select; // Export the component
        