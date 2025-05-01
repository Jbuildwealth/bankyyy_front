// src/components/dashboard/RenameAccountModal.jsx
import React, { useState, useEffect } from 'react';
import Button from '../Button.jsx'; // Assuming Button component exists
import Input from '../Input.jsx'; // Assuming Input component exists
import { Alert, AlertDescription } from '../Alert.jsx'; // Assuming Alert component exists

const RenameAccountModal = ({ isOpen, onClose, account, onSave, apiError }) => {
    const [nickname, setNickname] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(''); // Local error state

    useEffect(() => {
        // Pre-fill with existing nickname or empty string when modal opens/account changes
        if (account) {
            setNickname(account.accountNickname || '');
            setError(''); // Clear previous errors when opening
        }
    }, [account]); // Rerun when the account prop changes

    // Clear local error if apiError prop changes (cleared by parent)
     useEffect(() => {
        setError(apiError || '');
     }, [apiError]);

    const handleSave = async (e) => {
        e.preventDefault();
        // Basic validation (optional, backend also validates)
        if (nickname.length > 50) {
            setError('Nickname cannot exceed 50 characters.');
            return;
        }

        setIsSaving(true);
        setError(''); // Clear local error before saving
        try {
            // Call parent save function (which calls the API)
            await onSave(account._id, nickname.trim());
            // Parent component (AccountList) handles closing the modal on success via its onAccountRenamed prop -> closeRenameModal
        } catch (err) {
            // Error is likely set by the parent via apiError prop, but we catch just in case
            console.error("Error during rename save:", err);
            // setError(err.message || 'Failed to save nickname.'); // Let parent handle error display via prop
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !account) return null; // Don't render if not open or no account data

    return (
        // Simple Modal Structure (using fixed position overlay)
        // You might replace this with a proper modal library if you have one
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center transition-opacity duration-300 ease-out" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-enter">
                <div className="flex justify-between items-center mb-4">
                    <h3 id="modal-title" className="text-lg font-medium leading-6 text-gray-900">
                        Rename Account
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving} aria-label="Close modal">
                        {/* Close Icon (X) */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-700">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>

                <p className="text-sm text-gray-600 mb-1">Account Number: <span className="font-mono">{account.accountNumber}</span></p>
                <p className="text-sm text-gray-600 mb-4">Type: <span className="capitalize">{account.accountType}</span></p>

                {/* Display API Error if provided by parent */}
                {error && (
                     <Alert variant="destructive" className="mb-4">
                         <AlertDescription>{error}</AlertDescription>
                     </Alert>
                 )}

                <form onSubmit={handleSave}>
                    <Input
                        label="Account Nickname (Optional)"
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g., Bills Account, Savings Goal"
                        maxLength={51} // Slightly higher to catch validation message
                        disabled={isSaving}
                        required={false} // Nickname is optional
                        className="mb-2"
                    />
                     <p className="text-xs text-gray-500 mt-1 mb-4">Leave blank to remove the current nickname.</p>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" isLoading={isSaving} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Nickname'}
                        </Button>
                    </div>
                </form>
            </div>
            {/* Add keyframes for modal animation in your global CSS if needed */}
            <style>{`
                @keyframes modal-enter {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-modal-enter { animation: modal-enter 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default RenameAccountModal;