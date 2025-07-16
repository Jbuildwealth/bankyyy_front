        // src/components/Spinner.jsx
        import React from 'react';

        // Simple SVG spinner component
        const Spinner = ({ className = '' }) => (
            <svg
                // Apply spinning animation and size/color styles
                className={`animate-spin h-5 w-5 text-current ${className}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25" // Make the base circle semi-transparent
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor" // Use the current text color for the stroke
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75" // Make the moving arc more opaque
                    fill="currentColor" // Use the current text color for the fill
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        );

        export default Spinner; // Export the component
        