// src/components/dashboard/CreateAccountForm.jsx
import React, { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef
import api from '../../services/api.js';
import Button from '../Button.jsx';
import Select from '../Select.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../Card.jsx';
import { Alert, AlertDescription, AlertTitle } from '../Alert.jsx'; // Added AlertTitle
import Spinner from '../Spinner.jsx';

const CreateAccountForm = ({ onAccountCreated }) => {
    const [accountType, setAccountType] = useState('checking');
    // Use status constants for clarity
    const STATUS_IDLE = 'idle';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';

    const [processStatus, setProcessStatus] = useState(STATUS_IDLE);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const timeoutRef = useRef(null);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, []);

     // Effect to clear SUCCESS status after a delay
    useEffect(() => {
      if (processStatus === STATUS_SUCCESS) {
          timeoutRef.current = setTimeout(() => {
              setProcessStatus(prevStatus => prevStatus === STATUS_SUCCESS ? STATUS_IDLE : prevStatus);
              setFeedbackMessage('');
          }, 3500); // Duration success message stays
      }
      return () => { if (timeoutRef.current && processStatus === STATUS_SUCCESS) clearTimeout(timeoutRef.current); };
    }, [processStatus]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setFeedbackMessage('');
        setProcessStatus(STATUS_PROCESSING);
        setFeedbackMessage('Submitting request...');

        try {
            const newAccount = await api.createAccount({ accountType });

            // Simulate short processing
            setFeedbackMessage('Setting up account...');
            await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate 1.2 sec delay

            setProcessStatus(STATUS_SUCCESS);
            setFeedbackMessage(`Created ${newAccount.data.accountType} account (${newAccount.data.accountNumber})!`);
            onAccountCreated(); // Callback to refresh parent state

        } catch (err) {
            console.error("Create account error:", err);
            setProcessStatus(STATUS_ERROR);
            setFeedbackMessage(err.message || "Failed to create account.");
        }
        // No finally needed here as success state handles timeout
    };

    const isLoading = processStatus === STATUS_PROCESSING;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Account</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Show error or success message */}
                    <Alert variant={processStatus === STATUS_ERROR ? "destructive" : "success"} show={processStatus === STATUS_ERROR || processStatus === STATUS_SUCCESS}>
                         <AlertTitle>{processStatus === STATUS_ERROR ? 'Error' : 'Success'}</AlertTitle>
                         <AlertDescription>{feedbackMessage}</AlertDescription>
                    </Alert>

                    <div>
                        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        <Select
                            id="accountType"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                        </Select>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <><Spinner className="mr-2"/> {feedbackMessage || 'Processing...'} </> : 'Create Account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateAccountForm;
