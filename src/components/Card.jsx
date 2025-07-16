        // src/components/Card.jsx
        import React from 'react';

        // Main Card component wrapper
        const Card = ({ children, className = '', ...props }) => {
          return (
            <div
              // Base styles for the card container
              className={`rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`}
              {...props}
            >
              {children}
            </div>
          );
        };

        // Card Header section
        const CardHeader = ({ children, className = '', ...props }) => {
          return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>;
        };

        // Card Title element
        const CardTitle = ({ children, className = '', ...props }) => {
          return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>;
        };

        // Card Description element
        const CardDescription = ({ children, className = '', ...props }) => {
          return <p className={`text-sm text-gray-500 ${className}`} {...props}>{children}</p>;
        };

        // Card Content section
        const CardContent = ({ children, className = '', ...props }) => {
          // Note: Default padding top is 0 (pt-0) as header usually provides top padding
          return <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>;
        };

        // Card Footer section
        const CardFooter = ({ children, className = '', ...props }) => {
          // Note: Default padding top is 0 (pt-0)
          return <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>;
        };

        // Export all card-related components as named exports
        export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
        