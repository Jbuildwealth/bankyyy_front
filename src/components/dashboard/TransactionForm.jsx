// src/components/dashboard/TransactionForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import Button from '../Button.jsx';
import Input from '../Input.jsx';
import Select from '../Select.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../Card.jsx';
import { Alert, AlertDescription, AlertTitle } from '../Alert.jsx';
import Spinner from '../Spinner.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const TransactionForm = ({ title, accounts, transactionType, onTransactionSuccess }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?._id || '');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    // --- NEW STATE for custom date ---
    const [customDate, setCustomDate] = useState(''); // Store as string YYYY-MM-DDTHH:mm
    // ---------------------------------

    const STATUS_IDLE = 'idle';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';

    const [processStatus, setProcessStatus] = useState(STATUS_IDLE);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (accounts.length > 0 && !accounts.find(acc => acc._id === selectedAccountId)) {
            setSelectedAccountId(accounts[0]._id);
        } else if (accounts.length === 0) {
            setSelectedAccountId('');
        }
    }, [accounts, selectedAccountId]);

    useEffect(() => { return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }; }, []);
    useEffect(() => { if (processStatus === STATUS_SUCCESS) { timeoutRef.current = setTimeout(() => { setProcessStatus(prevStatus => prevStatus === STATUS_SUCCESS ? STATUS_IDLE : prevStatus); setFeedbackMessage(''); }, 3500); } return () => { if (timeoutRef.current && processStatus === STATUS_SUCCESS) clearTimeout(timeoutRef.current); }; }, [processStatus]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setFeedbackMessage('');
        if (!selectedAccountId) { setProcessStatus(STATUS_ERROR); setFeedbackMessage("Please select an account."); return; }
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setProcessStatus(STATUS_ERROR); setFeedbackMessage("Please enter a valid positive amount."); return; }

        setProcessStatus(STATUS_PROCESSING);
        setFeedbackMessage('Submitting transaction...');

        const transactionData = {
            accountId: selectedAccountId,
            type: transactionType,
            amount: amount, // Send as string
            description: description || `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`,
            // --- ADD custom date if provided ---
            // Send in ISO 8601 format (YYYY-MM-DDTHH:mm), which datetime-local provides
            ...(customDate && { transactionDate: customDate })
            // ------------------------------------
        };
        console.log("Sending transaction data:", transactionData); // Log data being sent

        try {
            const result = await api.createTransaction(transactionData);

            setFeedbackMessage('Updating balance...'); // Keep simulation simple here
            await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for feedback

            setProcessStatus(STATUS_SUCCESS);
            setFeedbackMessage(`${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} of ${formatCurrency(result.amount)} successful! New balance: ${formatCurrency(result.balanceAfter)}`);
            onTransactionSuccess();
            setAmount('');
            setDescription('');
            setCustomDate(''); // Clear custom date field
        } catch (err) {
            console.error(`${title} error:`, err);
            setProcessStatus(STATUS_ERROR);
            setFeedbackMessage(err.message || `Failed to process ${transactionType}.`);
        }
    };

    const isLoading = processStatus === STATUS_PROCESSING;

    return (
        <Card>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Alert variant={processStatus === STATUS_ERROR ? "destructive" : "success"} show={processStatus === STATUS_ERROR || processStatus === STATUS_SUCCESS}>
                         <AlertTitle>{processStatus === STATUS_ERROR ? 'Error' : 'Success'}</AlertTitle>
                         <AlertDescription>{feedbackMessage}</AlertDescription>
                    </Alert>

                    {/* Account Select */}
                    <div>
                        <label htmlFor={`${transactionType}-account`} className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                        <Select id={`${transactionType}-account`} value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)} disabled={isLoading || accounts.length === 0} required>
                            <option value="" disabled>{accounts.length === 0 ? 'No accounts available' : 'Select Account'}</option>
                            {accounts.map(acc => (<option key={acc._id} value={acc._id}>{`${acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} (${acc.accountNumber}) - Bal: ${formatCurrency(acc.balance)}`}</option>))}
                        </Select>
                    </div>
                    {/* Amount Input */}
                    <div>
                        <label htmlFor={`${transactionType}-amount`} className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <Input id={`${transactionType}-amount`} type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={isLoading || !selectedAccountId}/>
                    </div>
                    {/* Description Input */}
                    <div>
                        <label htmlFor={`${transactionType}-description`} className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <Input id={`${transactionType}-description`} type="text" placeholder="E.g., Paycheck, Groceries" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading || !selectedAccountId}/>
                    </div>
                    {/* --- NEW Custom Date Input --- */}
                     <div>
                        <label htmlFor={`${transactionType}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date & Time (Optional)</label>
                        <Input
                            id={`${transactionType}-date`}
                            type="datetime-local" // Input type for date and time
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            disabled={isLoading || !selectedAccountId}
                            // Optional: Add max property to prevent future dates client-side
                            // max={new Date().toISOString().slice(0, 16)}
                         />
                         <p className="text-xs text-gray-500 mt-1">Leave blank to use current time.</p>
                    </div>
                    {/* ----------------------------- */}
                    <Button type="submit" disabled={isLoading || !selectedAccountId} className="w-full">
                        {isLoading ? <><Spinner className="mr-2"/> {feedbackMessage || 'Processing...'} </> : `Submit ${title}`}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TransactionForm;
