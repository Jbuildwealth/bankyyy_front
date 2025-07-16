// src/components/dashboard/ExternalTransferForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api.js'; // Use API service
// Import shared UI components
import Button from '../Button.jsx';
import Input from '../Input.jsx';
import Select from '../Select.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../Card.jsx';
import { Alert, AlertDescription } from '../Alert.jsx';
import Spinner from '../Spinner.jsx';
// Import helper functions (assuming they are in utils)
import { formatCurrency } from '../../utils/formatters.js';

const ExternalTransferForm = ({ accounts, onTransferSuccess }) => {
    // State for the form fields
    const [fromAccountId, setFromAccountId] = useState(accounts[0]?._id || '');
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    // State for loading and feedback messages
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Update selected 'from' account if accounts list changes
    useEffect(() => {
        if (accounts.length > 0 && !accounts.find(acc => acc._id === fromAccountId)) {
            setFromAccountId(accounts[0]._id);
        } else if (accounts.length === 0) {
            setFromAccountId('');
        }
    }, [accounts, fromAccountId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic client-side validation
        if (!fromAccountId) { setError("Please select your 'From' account."); return; }
        if (!recipientAccountNumber.trim()) { setError("Please enter the recipient's account number."); return; }
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setError("Please enter a valid positive amount."); return; }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const transferData = {
            fromAccountId,
            recipientAccountNumber: recipientAccountNumber.trim(), // Send trimmed account number
            amount: amount, // Send as string
            description: description || `Transfer to ${recipientAccountNumber.trim()}`,
        };

        try {
            // Call the NEW API function
            const result = await api.transferToExternalAccount(transferData);
            setSuccess(result.message || `Transfer of ${formatCurrency(amount)} successful!`); // Use message from backend if available
            onTransferSuccess(); // Notify parent to refetch accounts/transactions
            // Clear form fields on success
            setRecipientAccountNumber('');
            setAmount('');
            setDescription('');
        } catch (err) {
            console.error("External Transfer error:", err);
            // Display error message from backend or a generic one
            setError(err.message || "Failed to process external transfer.");
        } finally {
            setIsLoading(false);
        }
    };

    // Disable form if user has no accounts
    const canTransfer = accounts.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transfer to Another User</CardTitle>
            </CardHeader>
            <CardContent>
                {!canTransfer ? (
                     <Alert variant="default"><AlertDescription>You need an account to send transfers from.</AlertDescription></Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        {success && <Alert variant="success"><AlertDescription>{success}</AlertDescription></Alert>}

                        {/* From Account Dropdown */}
                        <div>
                            <label htmlFor="extFromAccount" className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                            <Select
                                id="extFromAccount"
                                value={fromAccountId}
                                onChange={(e) => setFromAccountId(e.target.value)}
                                disabled={isLoading}
                                required
                            >
                                <option value="" disabled>Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc._id} value={acc._id}>
                                        {acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} ({acc.accountNumber}) - Bal: {formatCurrency(acc.balance)}
                                    </option>
                                ))}
                            </Select>
                        </div>

                         {/* Recipient Account Number Input */}
                        <div>
                            <label htmlFor="recipientAccNum" className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
                            <Input
                                id="recipientAccNum"
                                type="text" // Text input for account number
                                placeholder="Enter recipient's ACC-..."
                                value={recipientAccountNumber}
                                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                                required
                                disabled={isLoading || !fromAccountId}
                            />
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label htmlFor="extTransferAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <Input
                                id="extTransferAmount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                disabled={isLoading || !fromAccountId}
                            />
                        </div>

                        {/* Description Input */}
                        <div>
                            <label htmlFor="extTransferDesc" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                            <Input
                                id="extTransferDesc"
                                type="text"
                                placeholder="E.g., Payment for goods"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isLoading || !fromAccountId}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" disabled={isLoading || !fromAccountId} className="w-full">
                            {isLoading ? <><Spinner className="mr-2"/> Sending Transfer...</> : 'Send Transfer'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default ExternalTransferForm;
