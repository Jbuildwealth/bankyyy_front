// src/services/api.js

// Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this is correct

// API Service Object
const api = {
    // Central request helper function (cleaned up)
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('authToken');

        console.log(`>>> API Request: ${options.method || 'GET'} ${url}`); // Keep basic log

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 204) {
                console.log(`<<< API Request Success: ${options.method || 'GET'} ${url} (Status: 204 No Content)`);
                return null;
            }

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                 try {
                    data = await response.json();
                 } catch (jsonError) {
                    console.error('API JSON Parse Error:', jsonError, 'Status:', response.status, 'URL:', url);
                    const parseError = new Error('Failed to parse server JSON response.');
                    parseError.status = response.status;
                    throw parseError;
                 }
            } else {
                const responseText = await response.text();
                // If response is OK but not JSON, create a message object
                // If response is not OK and not JSON, the error thrown below will use the text
                 if(response.ok) {
                     data = { message: responseText || `Received status ${response.status} with non-JSON body.` };
                 } else {
                     // Store text for error message if !response.ok
                     data = { _rawText: responseText };
                 }
            }

            if (!response.ok) {
                const errorMessage = data?.message // Use message if parsed JSON had one
                                    || data?._rawText // Use raw text if non-JSON error
                                    || `HTTP error! status: ${response.status}`; // Fallback
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = data; // Attach response data/text
                console.error(`API Error Response: ${options.method || 'GET'} ${url} (Status: ${error.status})`, error.message);
                throw error;
            }
            console.log(`<<< API Request Success: ${options.method || 'GET'} ${url} (Status: ${response.status})`);
            return data;

        } catch (error) {
            // Log only if it's not an error we already created/logged
            if (!error.status) {
                 console.error(`<<< API Request Network/Processing FAIL: ${options.method || 'GET'} ${url}. Error:`, error);
            }
            // Standardize or re-throw
            if (error.status) { throw error; }
            if (error instanceof TypeError) { // Often network errors
                 const networkError = new Error('Network error: Could not connect to the server.');
                 networkError.isNetworkError = true;
                 throw networkError;
            }
            const unexpectedError = new Error(error.message || 'An unexpected error occurred during the API request.');
            throw unexpectedError;
        }
    },

    // --- Authentication ---
    login(credentials) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); },
    register(userData) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }); },

    // --- User Profile ---
    getUserProfile() { return this.request('/users/profile'); },
    updateUserProfile(profileData) { return this.request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) }); },
    // TODO: Add changePassword API call here later
    // changePassword(passwordData) { return this.request('/auth/change-password', { method: 'PUT', body: JSON.stringify(passwordData) }); },


    // --- Accounts ---
    getAccounts() { return this.request('/accounts'); },
    createAccount(accountData) { return this.request('/accounts', { method: 'POST', body: JSON.stringify(accountData) }); },
    deleteAccount(accountId) { return this.request(`/accounts/${accountId}`, { method: 'DELETE' }); },
    renameAccount(accountId, accountNickname) { return this.request(`/accounts/${accountId}/rename`, { method: 'PUT', body: JSON.stringify({ accountNickname }) }); },

    // --- Transactions (Read) ---
    getTransactions() { return this.request('/transactions'); },
    getTransactionsForAccount(accountId) { return this.request(`/transactions/account/${accountId}`); }, // Assuming endpoint is correct

    // --- Transactions (Create - Deposit/Withdrawal - No OTP) ---
    createTransaction(transactionData) { return this.request('/transactions', { method: 'POST', body: JSON.stringify(transactionData) }); },

    // --- OTP Transfer Flow ---
    initiateTransfer(transferDetails) {
        // transferDetails should include: { transferType, fromAccountId, toAccountId?, recipientAccountNumber?, amount, description? }
        return this.request('/transactions/transfer/initiate', {
            method: 'POST',
            body: JSON.stringify(transferDetails)
        });
    },
    executeTransfer(detailsWithOtp) {
         // detailsWithOtp should include: { transferType, fromAccountId, toAccountId?, recipientAccountNumber?, amount, description?, otp }
        return this.request('/transactions/transfer/execute', {
            method: 'POST',
            body: JSON.stringify(detailsWithOtp)
        });
    },
    // --- End OTP Transfer Flow ---


    // --- Old Direct Transfer Functions (Commented Out - Use OTP flow) ---
    // transfer(transferData) {
    //     console.warn("Deprecated API call: api.transfer used. Use OTP flow.");
    //     return this.request('/transactions/transfer', { method: 'POST', body: JSON.stringify(transferData) });
    // },
    // transferToExternalAccount(transferData) {
    //     console.warn("Deprecated API call: api.transferToExternalAccount used. Use OTP flow.");
    //     return this.request('/transactions/external-transfer', { method: 'POST', body: JSON.stringify(transferData) });
    // },
    // ------------------------------------------------------------------

};

export default api;