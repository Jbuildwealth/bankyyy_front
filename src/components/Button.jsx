// src/components/Button.jsx
import React from 'react';
// Import Spinner if it's a separate component, otherwise define it below
// import Spinner from './Spinner';

const Button = ({
    children,
    onClick,
    variant = 'default',
    size = 'default', // Add size prop with a default
    className = '',
    type = 'button',
    isLoading = false, // Optional: Add isLoading prop
    ...props // Capture rest of the props like 'disabled'
}) => {

    // Base styles remain the same
    const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // Variant styles remain the same
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700/90",
        destructive: "bg-red-600 text-white hover:bg-red-700/90",
        outline: "border border-input bg-white hover:bg-gray-100 hover:text-gray-900", // Assuming input border class exists in your CSS/Tailwind setup
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900", // Ghost only adds hover styling
        link: "text-blue-600 underline-offset-4 hover:underline",
    };

    // --- NEW: Define styles for different sizes ---
    const sizes = {
        default: "h-10 px-4 py-2",       // Standard button size
        sm: "h-9 rounded-md px-3",       // Small button size
        lg: "h-11 rounded-md px-8",       // Large button size
        icon: "h-9 w-9",                 // Icon button size (square, adjust h/w as needed, e.g., h-8 w-8 or h-10 w-10)
    };
    // --- END NEW ---

    // Combine base, variant, size, and custom classes
    // Remove the fixed px-4 py-2 from the original implementation
    const combinedClassName = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            type={type}
            className={combinedClassName}
            onClick={onClick}
            // Disable button if isLoading is true or if disabled prop is passed
            disabled={isLoading || props.disabled}
            {...props} // Spread the rest of the props (including potentially disabled)
        >
            {/* Conditionally render spinner or children */}
            {isLoading ? (
                 <>
                    {/* Use a simple inline spinner or import your Spinner component */}
                    <svg className={`animate-spin mr-2 ${size === 'sm' || size === 'icon' ? 'h-4 w-4' : 'h-5 w-5'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {/* Optionally show loading text, or rely on children */}
                    {typeof children === 'string' ? 'Processing...' : children}
                 </>
            ) : (
                 children // Render normal button content (like the SVG icon)
            )}
        </button>
    );
};

// If you don't have a separate Spinner component, you can keep this basic one here
// Or remove if you import it
/*
const Spinner = ({ size = 'sm', className = '' }) => {
     const sizeClasses = {
         xs: 'h-3 w-3',
         sm: 'h-4 w-4',
         default: 'h-5 w-5',
         lg: 'h-6 w-6',
     };
     return (
         <svg
             className={`animate-spin ${sizeClasses[size] || sizeClasses.default} ${className}`}
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
         >
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
     );
 };
*/

export default Button; // Export the component