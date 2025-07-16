// src/components/Alert.jsx
import React, { useState, useEffect } from 'react';

// Main Alert component wrapper
const Alert = ({ children, variant = 'default', className = '', show = true }) => {
    // State to control opacity for fade effect
    const [isVisible, setIsVisible] = useState(false);

    // Effect to trigger fade-in when 'show' prop becomes true
    useEffect(() => {
        if (show) {
            // Use requestAnimationFrame to ensure the initial state (opacity-0) is applied before transitioning
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
        }
    }, [show]); // Dependency array includes 'show'

    // Define base styles and variant styles
    const baseStyle = "relative w-full rounded-lg border p-4 transition-opacity duration-500 ease-in-out"; // Added transition classes
    const variants = {
        default: "bg-gray-100 text-gray-900 border-gray-200",
        destructive: "border-red-500/50 bg-red-50 text-red-700",
        success: "border-green-500/50 bg-green-50 text-green-700"
    };

    // Apply opacity class based on visibility state
    const visibilityClass = isVisible ? 'opacity-100' : 'opacity-0';

    // Render null if the 'show' prop is false initially (prevents rendering empty space)
    // The component will fade in when 'show' becomes true.
    // If 'show' becomes false again, it will fade out before potentially being removed by parent logic.
    if (!show && !isVisible) {
         return null; // Don't render anything if not supposed to show and already faded out
    }

    return (
        <div
            className={`${baseStyle} ${variants[variant]} ${visibilityClass} ${className}`}
            role="alert"
            // Optional: Add aria-live for screen readers if content changes dynamically
            // aria-live="polite"
        >
            {children}
        </div>
    );
};

// Alert Title element (no changes needed)
const AlertTitle = ({ children, className = '' }) => <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>;

// Alert Description element (no changes needed)
const AlertDescription = ({ children, className = '' }) => <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>;

// Export alert-related components as named exports
export { Alert, AlertTitle, AlertDescription };
