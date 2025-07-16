// src/utils/helpers.js

/**
 * Creates a pause for a specified duration.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} - A promise that resolves after the delay.
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add other helper functions here if needed
