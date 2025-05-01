// src/components/Textarea.jsx
import React from 'react';

const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      className={`block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      ref={ref}
      {...props}
    />
  );
});

export default Textarea;