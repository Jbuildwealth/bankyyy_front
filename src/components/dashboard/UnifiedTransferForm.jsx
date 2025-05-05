// src/components/dashboard/UnifiedTransferForm.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../../services/api.js';
import Button from '../Button.jsx';
import Input from '../Input.jsx';
import Select from '../Select.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../Card.jsx';
import { Alert, AlertDescription, AlertTitle } from '../Alert.jsx';
import Spinner from '../Spinner.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const UnifiedTransferForm = ({ accounts = [], onTransferSuccess, onOptimisticBalanceUpdate }) => { // Default accounts to []
    // --- State ---
    const [step, setStep] = useState('details'); // 'details' or 'otp'
    const [transferType, setTransferType] = useState('internal');
    // Initialize fromAccountId only if accounts exist
    const [fromAccountId, setFromAccountId] = useState(accounts.length > 0 ? accounts[0]._id : '');
    const [toAccountId, setToAccountId] = useState('');
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    // Store the details needed for the execute step
    const [transferDetailsForExecution, setTransferDetailsForExecution] = useState(null);
    const [otp, setOtp] = useState('');
    const STATUS_IDLE = 'idle';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SUCCESS = 'success';
    const STATUS_ERROR = 'error';
    const [formStatus, setFormStatus] = useState(STATUS_IDLE);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const timeoutRef = useRef(null);
    const [showOtpFlash, setShowOtpFlash] = useState(false);
    const [flashedOtp, setFlashedOtp] = useState('');
    const otpFlashTimeoutRef = useRef(null);
    const [otpProgress, setOtpProgress] = useState(100);
    const progressIntervalRef = useRef(null);
    // --- End State ---

    // --- Memoized Values ---
    const isProcessing = formStatus === STATUS_PROCESSING;

    const internalToAccountOptions = useMemo(() => {
        // Ensure accounts is an array before filtering
        if (!Array.isArray(accounts)) return [];
        return accounts.filter(acc => acc._id !== fromAccountId);
    }, [accounts, fromAccountId]);

    const canSubmitDetails = useMemo(() => {
         // Ensure accounts is an array
        if (!Array.isArray(accounts)) return false;
        if (!fromAccountId || !amount || parseFloat(amount) <= 0) return false;
        if (transferType === 'internal') {
            return !!toAccountId && fromAccountId !== toAccountId && accounts.length >= 2;
        } else { // external
            return !!recipientAccountNumber.trim() && /^\d{5,20}$/.test(recipientAccountNumber.trim()); // Basic account number check
        }
    }, [fromAccountId, amount, transferType, toAccountId, recipientAccountNumber, accounts]);

     const canSubmitOtp = useMemo(() => {
         return otp.trim().length === 6 && /^\d{6}$/.test(otp.trim());
     }, [otp]);
    // --- End Memoized Values ---


    // --- Effects ---
    // Set default 'from' account when accounts load or change
     useEffect(() => {
        if (accounts.length > 0 && !fromAccountId) {
            setFromAccountId(accounts[0]._id);
        }
        // If the currently selected fromAccountId is no longer valid, reset
        if (fromAccountId && !accounts.some(acc => acc._id === fromAccountId)) {
             setFromAccountId(accounts.length > 0 ? accounts[0]._id : '');
        }
    }, [accounts, fromAccountId]);

    // Reset 'to' account if 'from' account changes or type switches to internal
     useEffect(() => {
        if (transferType === 'internal') {
             // Reset if 'to' is same as 'from' or if 'to' is no longer a valid option
            const currentToIsValid = internalToAccountOptions.some(acc => acc._id === toAccountId);
             if (toAccountId === fromAccountId || !currentToIsValid) {
                // Set to the first available option, or empty if none
                 setToAccountId(internalToAccountOptions.length > 0 ? internalToAccountOptions[0]._id : '');
            }
        }
    }, [fromAccountId, internalToAccountOptions, toAccountId, transferType]);

     // Reset specific fields when transfer type changes
     useEffect(() => {
        setToAccountId('');
        setRecipientAccountNumber('');
        // Optionally reset amount/description too
        // setAmount('');
        // setDescription('');
    }, [transferType]);

    // Clear feedback message timeout on unmount or status change
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Auto-clear feedback messages
     useEffect(() => {
        if (formStatus === STATUS_SUCCESS || formStatus === STATUS_ERROR) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear existing timeout
            timeoutRef.current = setTimeout(() => {
                setFeedbackMessage('');
                setFormStatus(STATUS_IDLE);
                // Reset step only on success after execute
                if (formStatus === STATUS_SUCCESS && step === 'otp') {
                     resetFormFields(); // Fully reset after successful execution
                } else if (formStatus === STATUS_ERROR && step === 'otp') {
                    // Don't reset step on OTP error, allow retry
                } else {
                    // For other errors or initiate success, potentially reset step or fields if needed
                }
            }, 5000); // Hide after 5 seconds
        }
         // Cleanup on unmount
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [formStatus, step]); // Add step dependency

    // Cleanup OTP flash timeout
    useEffect(() => {
        return () => {
            if (otpFlashTimeoutRef.current) {
                clearTimeout(otpFlashTimeoutRef.current);
            }
        };
    }, []);

    // Cleanup intervals and timeouts
    useEffect(() => {
        return () => {
            if (otpFlashTimeoutRef.current) {
                clearTimeout(otpFlashTimeoutRef.current);
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, []);

    // --- Event Handlers ---
    const resetFormFields = useCallback(() => {
        setStep('details');
        // Don't reset transferType? Keep user's choice.
        setFromAccountId(accounts.length > 0 ? accounts[0]._id : '');
        setToAccountId('');
        setRecipientAccountNumber('');
        setAmount('');
        setDescription('');
        setOtp('');
        setTransferDetailsForExecution(null); // Clear stored details
        setFormStatus(STATUS_IDLE);
        setFeedbackMessage('');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [accounts]); // Add accounts dependency

    // --- Initiate Transfer Handler ---
    const handleInitiateTransfer = async (event) => {
        event.preventDefault();
        console.log(">>> handleInitiateTransfer: Form submitted");

        if (!canSubmitDetails) {
            console.log(">>> handleInitiateTransfer: Submission blocked, details invalid.");
            setFeedbackMessage("Please fill all required fields correctly.");
            setFormStatus(STATUS_ERROR);
            return;
        }

        setFormStatus(STATUS_PROCESSING);
        setFeedbackMessage('Initiating transfer...');

        const detailsToSend = {
            transferType,
            fromAccountId,
            amount,
            description: description.trim() || undefined,
            ...(transferType === 'internal' && { toAccountId }),
            ...(transferType === 'external' && { recipientAccountNumber: recipientAccountNumber.trim() })
        };

        console.log(">>> handleInitiateTransfer: Calling api.initiateTransfer with:", detailsToSend);

        try {
            const response = await api.initiateTransfer(detailsToSend);
            console.log(">>> handleInitiateTransfer: API Response:", response);

            // Show OTP flash screen with progress
            setFlashedOtp(response.otp);
            setShowOtpFlash(true);
            setOtpProgress(100);
            
            // Start progress bar animation
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            progressIntervalRef.current = setInterval(() => {
                setOtpProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(progressIntervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 50); // Update every 50ms for smooth animation
            
            // Hide OTP after 5 seconds
            if (otpFlashTimeoutRef.current) {
                clearTimeout(otpFlashTimeoutRef.current);
            }
            otpFlashTimeoutRef.current = setTimeout(() => {
                setShowOtpFlash(false);
                setFlashedOtp('');
                setOtpProgress(100);
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                }
            }, 5000);

            setFeedbackMessage(response.message || 'OTP initiated. Please check your device (or console).');
            setFormStatus(STATUS_IDLE);
            setTransferDetailsForExecution(detailsToSend);
            setStep('otp');

        } catch (error) {
            console.error(">>> handleInitiateTransfer: API Error:", error);
            setFeedbackMessage(error.message || 'Failed to initiate transfer.');
            setFormStatus(STATUS_ERROR);
            setTransferDetailsForExecution(null);
        }
    };

    // --- Execute Transfer Handler ---
    const handleExecuteTransfer = async (event) => {
        event.preventDefault(); // *** CRITICAL: Prevent default form submission ***
        console.log(">>> handleExecuteTransfer: Form submitted"); // DEBUG

        if (!canSubmitOtp || !transferDetailsForExecution) {
            console.log(">>> handleExecuteTransfer: Submission blocked, OTP invalid or details missing."); // DEBUG
            setFeedbackMessage("Invalid OTP format or missing transfer details.");
            setFormStatus(STATUS_ERROR);
            return;
        }

        setFormStatus(STATUS_PROCESSING);
        setFeedbackMessage('Verifying OTP and completing transfer...');

        // Combine stored details with the entered OTP
        const detailsWithOtp = {
            ...transferDetailsForExecution,
            otp: otp.trim()
        };

        console.log(">>> handleExecuteTransfer: Calling api.executeTransfer with:", detailsWithOtp); // DEBUG

        try {
            const response = await api.executeTransfer(detailsWithOtp);
            console.log(">>> handleExecuteTransfer: API Response:", response); // DEBUG

            setFeedbackMessage(response.message || 'Transfer completed successfully!');
            setFormStatus(STATUS_SUCCESS);
            setOtp(''); // Clear OTP field
            setTransferDetailsForExecution(null); // Clear stored details

            // Optimistically update balances
            if (typeof onOptimisticBalanceUpdate === 'function') {
                onOptimisticBalanceUpdate(
                    transferDetailsForExecution.fromAccountId,
                    transferDetailsForExecution.toAccountId,
                    transferDetailsForExecution.amount,
                    transferDetailsForExecution.transferType
                );
            }

            // Call the success callback passed from DashboardPage to trigger refresh
            if (onTransferSuccess) {
                onTransferSuccess('Transfer completed successfully!', false); // Don't refetch, just show message
            }

            // Reset form fields after a short delay (managed by useEffect on formStatus)
            // resetFormFields(); // Reset is handled by useEffect now

        } catch (error) {
            console.error(">>> handleExecuteTransfer: API Error:", error); // DEBUG
            setFeedbackMessage(error.message || 'Transfer failed. Please check OTP or try again.');
            setFormStatus(STATUS_ERROR);
            // Don't clear OTP or details on error, allow user to retry OTP
        }
    };

    // --- Cancel OTP Handler ---
    const handleCancelOtp = () => {
        console.log(">>> handleCancelOtp: Cancelling OTP step."); // DEBUG
        setStep('details');
        setOtp('');
        setTransferDetailsForExecution(null); // Clear stored details
        setFormStatus(STATUS_IDLE);
        setFeedbackMessage('Transfer cancelled.');
         // Optionally clear other fields too if desired
        // setAmount('');
        // setDescription('');
        // setRecipientAccountNumber('');
        // setToAccountId('');
    };
    // --- End Event Handlers ---


    // --- Render Logic ---
    return (
        <Card>
            <CardHeader><CardTitle>Make a Transfer</CardTitle></CardHeader>
            <CardContent>
                {/* OTP Flash Screen */}
                {showOtpFlash && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl text-center relative overflow-hidden">
                            <h3 className="text-xl font-bold mb-4">Your OTP</h3>
                            <div className="text-4xl font-mono font-bold tracking-wider mb-4 animate-pulse">
                                {flashedOtp}
                            </div>
                            {/* Progress Bar */}
                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-50 ease-linear"
                                    style={{ width: `${otpProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-600">
                                {otpProgress > 0 ? `Disappearing in ${Math.ceil(otpProgress / 20)}s` : 'Disappearing...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* --- Feedback Area --- */}
                 {feedbackMessage && (formStatus === STATUS_PROCESSING || formStatus === STATUS_ERROR || formStatus === STATUS_SUCCESS) && (
                     <Alert
                        variant={
                            formStatus === STATUS_PROCESSING ? "info" :
                            formStatus === STATUS_ERROR ? "destructive" :
                            formStatus === STATUS_SUCCESS ? "success" : "default"
                        }
                        className="mb-4"
                    >
                        {formStatus === STATUS_PROCESSING && <Spinner size="sm" className="mr-2 inline-block" />}
                        {formStatus === STATUS_ERROR && <AlertTitle>Error</AlertTitle>}
                        {formStatus === STATUS_SUCCESS && <AlertTitle>Success</AlertTitle>}
                        <AlertDescription>{feedbackMessage}</AlertDescription>
                    </Alert>
                 )}
                 {/* --- End Feedback Area --- */}

                {/* == STEP 1: Transfer Details Form == */}
                {step === 'details' && (
                    <form onSubmit={handleInitiateTransfer} className="space-y-4">
                        {/* Transfer Type Radio Buttons */}
                        <div className="flex items-center space-x-4 pt-2">
                             <label className="text-sm font-medium text-gray-700 shrink-0">Transfer To:</label>
                             <div className="flex items-center">
                                 <input type="radio" id="transferInternal" name="transferType" value="internal" checked={transferType === 'internal'} onChange={() => setTransferType('internal')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={isProcessing}/>
                                 <label htmlFor="transferInternal" className="ml-2 block text-sm text-gray-900">My Account</label>
                             </div>
                             <div className="flex items-center">
                                 <input type="radio" id="transferExternal" name="transferType" value="external" checked={transferType === 'external'} onChange={() => setTransferType('external')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" disabled={isProcessing}/>
                                 <label htmlFor="transferExternal" className="ml-2 block text-sm text-gray-900">Another User</label>
                             </div>
                         </div>
                        {/* From Account Select */}
                        <Select
                            label="From Account"
                            id="unifiedFromAccount"
                            value={fromAccountId}
                            onChange={(e) => setFromAccountId(e.target.value)}
                            disabled={isProcessing || !Array.isArray(accounts) || accounts.length === 0}
                            required
                        >
                             <option value="" disabled>{!Array.isArray(accounts) || accounts.length === 0 ? 'No accounts available' : 'Select Account'}</option>
                             {Array.isArray(accounts) && accounts.map(acc => (
                                <option key={acc._id} value={acc._id}>
                                    {`${acc.accountNickname || (acc.accountType?.charAt(0).toUpperCase() + acc.accountType?.slice(1))} (${acc.accountNumber}) - Bal: ${formatCurrency(acc.balance)}`}
                                </option>
                            ))}
                         </Select>
                        {/* Conditional Recipient Input */}
                        {transferType === 'internal' && (
                            <Select
                                label="To Account (Self)"
                                id="unifiedToAccount"
                                value={toAccountId}
                                onChange={(e) => setToAccountId(e.target.value)}
                                disabled={isProcessing || !fromAccountId || internalToAccountOptions.length === 0}
                                required={transferType === 'internal'} // Required only for internal
                            >
                                 <option value="" disabled>{internalToAccountOptions.length === 0 ? 'No other account available' : 'Select Account'}</option>
                                 {internalToAccountOptions.map(acc => (
                                    <option key={acc._id} value={acc._id}>
                                        {`${acc.accountNickname || (acc.accountType?.charAt(0).toUpperCase() + acc.accountType?.slice(1))} (${acc.accountNumber})`}
                                    </option>
                                ))}
                             </Select>
                        )}
                        {transferType === 'external' && (
                            <Input
                                label="Recipient Account Number"
                                id="unifiedRecipientAccNum"
                                type="text"
                                placeholder="Enter 5-20 digit account number" // Adjust placeholder
                                value={recipientAccountNumber}
                                onChange={(e) => setRecipientAccountNumber(e.target.value.replace(/\D/g, ''))} // Allow only digits
                                required={transferType === 'external'} // Required only for external
                                disabled={isProcessing || !fromAccountId}
                                maxLength={20} // Adjust max length if needed
                                minLength={5} // Adjust min length if needed
                                inputMode="numeric"
                                pattern="\d{5,20}" // Regex for 5-20 digits
                            />
                        )}
                        {/* Amount Input */}
                        <Input
                            label="Amount"
                            id="unifiedTransferAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            disabled={isProcessing || !fromAccountId}
                        />
                        {/* Description Input */}
                        <Input
                            label="Description (Optional)"
                            id="unifiedTransferDesc"
                            type="text"
                            placeholder="E.g., Rent, Lunch money"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isProcessing || !fromAccountId}
                        />
                        {/* Submit Button for Details */}
                         <Button type="submit" disabled={isProcessing || !canSubmitDetails} className="w-full">
                             {isProcessing ? <><Spinner size="sm" className="mr-2"/> Please wait...</> : 'Continue to Verify'}
                         </Button>
                    </form>
                )}

                {/* == STEP 2: OTP Verification Form == */}
                {step === 'otp' && transferDetailsForExecution && ( // Ensure details are stored before showing
                    <form onSubmit={handleExecuteTransfer} className="space-y-4">
                        {/* Display message - already handled by feedback area */}
                        {/* <p className="text-sm text-center text-gray-700">{feedbackMessage || 'Enter the 6-digit OTP sent (check backend console).'}</p> */}
                        <Input
                            label="One-Time Password (OTP)"
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            pattern="\d{6}"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Allow only digits
                            required
                            disabled={isProcessing}
                            className="text-center tracking-[0.5em] text-lg font-medium"
                            placeholder="------"
                        />
                         <div className="flex justify-between items-center gap-3">
                             <Button type="button" variant="outline" onClick={handleCancelOtp} disabled={isProcessing}>
                                 Cancel
                             </Button>
                             <Button type="submit" disabled={isProcessing || !canSubmitOtp}>
                                 {isProcessing ? <><Spinner size="sm" className="mr-2"/> Verifying...</> : 'Complete Transfer'}
                             </Button>
                         </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default UnifiedTransferForm;
