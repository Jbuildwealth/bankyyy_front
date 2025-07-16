// src/utils/formatters.js

/**
 * Formats a numerical string or number into a currency string (e.g., $1,234.56).
 * Uses Intl.NumberFormat for localization support.
 * @param {string|number|null|undefined} value - The value to format.
 * @param {string} [locale='en-US'] - The locale string (e.g., 'en-GB', 'de-DE').
 * @param {string} [currency='USD'] - The currency code (e.g., 'GBP', 'EUR').
 * @returns {string} - The formatted currency string or "N/A".
 */
export const formatCurrency = (value, locale = 'en-US', currency = 'USD') => {
    // Handle null, undefined, or non-numeric strings early
    if (value === null || value === undefined || value === '') return "N/A";

    const num = parseFloat(value);
    if (isNaN(num)) return "N/A"; // Return N/A if parsing fails

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(num);
    } catch (error) {
        console.error("Error formatting currency:", error);
        return "N/A"; // Fallback on error
    }
};

/**
 * Formats a date string or Date object into a localized date/time string.
 * Uses Intl.DateTimeFormat for localization support.
 * @param {string|Date|null|undefined} dateString - The date value to format.
 * @param {string} [locale='en-US'] - The locale string.
 * @param {object} [options] - Optional Intl.DateTimeFormat options (e.g., { dateStyle: 'long' }).
 * @returns {string} - The formatted date/time string or "N/A".
 */
export const formatDate = (dateString, locale = 'en-US', options = {}) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        // Check if the date is valid after parsing
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        // Default options if none provided
        const defaultOptions = {
            dateStyle: 'medium', // e.g., Apr 26, 2025
            timeStyle: 'short'   // e.g., 1:15 AM
        };

        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Date"; // Fallback on error
    }
};
