// src/components/dashboard/AccountList.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api.js';
import { Card, CardTitle, CardDescription } from '../Card.jsx';
import { Alert, AlertDescription } from '../Alert.jsx';
import Spinner from '../Spinner.jsx';
import Button from '../Button.jsx'; // Make sure Button.jsx has size="icon" support from previous step
import { formatCurrency } from '../../utils/formatters.js';
import RenameAccountModal from './RenameAccountModal.jsx';

const AccountList = ({ accounts, isLoading, error, onViewTransactions, onAccountDeleted, onAccountRenamed }) => {
    // State for deletion process
    const [accountIdToDelete, setAccountIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // State for Dropdown Menu
    const [openMenuAccountId, setOpenMenuAccountId] = useState(null);
    const menuRef = useRef(null);

    // State for Rename Modal
    const [isRenaming, setIsRenaming] = useState(false);
    const [accountToRename, setAccountToRename] = useState(null);
    const [renameApiError, setRenameApiError] = useState(null);

    // Click Outside Handler
    useEffect(() => {
        const handleClickOutside = (event) => {
             if (openMenuAccountId && menuRef.current && !menuRef.current.contains(event.target)) {
                const clickedToggleButton = event.target.closest(`[data-menu-button-for="${openMenuAccountId}"]`);
                if (!clickedToggleButton) {
                    setOpenMenuAccountId(null);
                }
             }
        };
        if (openMenuAccountId) { document.addEventListener('mousedown', handleClickOutside); }
        else { document.removeEventListener('mousedown', handleClickOutside); }
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [openMenuAccountId]);

    // Loading/Error/Empty states
    if (isLoading) { return <div className="flex justify-center items-center p-4"><Spinner /> Loading accounts...</div>; }
    if (error) { return <Alert variant="destructive"><AlertDescription>{`Error: ${error}`}</AlertDescription></Alert>; }
    if (!Array.isArray(accounts) || accounts.length === 0) { return <p className="text-gray-500">You don't have any accounts yet.</p>; }

    // Menu Toggle Handler
    const handleToggleMenu = (accountId, event) => {
        event.stopPropagation();
        setOpenMenuAccountId(prev => (prev === accountId ? null : accountId));
        setDeleteError(null);
    };

    // Rename Handlers
    const openRenameModal = (account) => {
        console.log("Opening rename modal for:", account);
        setAccountToRename(account);
        setRenameApiError(null);
        setIsRenaming(true);
        setOpenMenuAccountId(null);
    };

    const closeRenameModal = () => {
        setIsRenaming(false);
        setAccountToRename(null);
        setRenameApiError(null);
    };

    const handleRenameSave = async (accountId, newNickname) => {
        setRenameApiError(null);
        console.log(`Attempting to save nickname for ${accountId}: "${newNickname}"`);
        try {
            await api.renameAccount(accountId, newNickname);
            if (onAccountRenamed) {
                 onAccountRenamed();
            }
            closeRenameModal();
        } catch (err) {
            console.error("Failed to rename account via API:", err);
            setRenameApiError(err.message || 'An error occurred. Please try again.');
        }
    };

    // Other Action Handlers
    const handleViewTransactions = (accountId) => {
        console.log(`ACTION: View transactions for account ${accountId}`);
        setOpenMenuAccountId(null);
        if (onViewTransactions) { onViewTransactions(accountId); }
        else { console.warn("onViewTransactions handler not provided"); }
    };

    const handleGenerateStatement = (accountId) => {
        console.log(`ACTION: Generate statement for account ${accountId}`);
        setOpenMenuAccountId(null);
        alert("Generate Statement functionality not implemented yet.");
    };

    const handleDeleteConfirm = (account) => {
        setOpenMenuAccountId(null);
        if (account.balance && account.balance.toString() !== '0.00') {
            alert(`Account ${account.accountNumber} must have a zero balance. Balance: ${formatCurrency(account.balance)}`);
            return;
        }
        if (window.confirm(`DELETE Account ${account.accountNumber} (${account.accountType})?\nBalance MUST be zero.\nCannot be undone.`)) {
            setAccountIdToDelete(account._id);
            setIsDeleting(true);
            setDeleteError(null);
            api.deleteAccount(account._id)
                .then(() => { alert('Account deleted!'); if (onAccountDeleted) { onAccountDeleted(); } })
                .catch(err => { console.error("Delete account error:", err); setDeleteError(err.message); alert(`Error: ${err.message}`); })
                .finally(() => { setIsDeleting(false); setAccountIdToDelete(null); });
        }
    };

    return (
        <div className="space-y-4">
            {deleteError && !accountIdToDelete && (<Alert variant="destructive"><AlertDescription>{deleteError}</AlertDescription></Alert>)}

            {accounts.map((account) => (
                <Card key={account._id} className="relative overflow-visible flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border hover:shadow-md transition-shadow duration-200">
                    {/* Account Info */}
                    <div className="mb-3 sm:mb-0 flex-grow mr-4">
                        <CardTitle className="text-lg font-semibold">
                            {account.accountNickname || `${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account`}
                        </CardTitle>
                        {account.accountNickname && (
                            <CardDescription className="text-xs text-gray-500 mt-0.5 capitalize">
                                {account.accountType} • Acc No: {account.accountNumber}
                            </CardDescription>
                        )}
                         {!account.accountNickname && (
                             <CardDescription className="text-xs text-gray-500 mt-0.5">
                                 Acc No: {account.accountNumber}
                             </CardDescription>
                         )}
                        <div className="mt-2">
                            <p className="text-xl font-bold text-gray-800">{formatCurrency(account.balance)}</p>
                            <p className="text-xs text-gray-500">Current Balance</p>
                        </div>
                    </div>

                    {/* Actions Button Container */}
                    <div className="flex-shrink-0">
                    {/* ------------------------- */}

                        {/* The Ellipsis Button */}
                        <Button
                            // --- Use secondary variant for grey background ---
                            variant="secondary"
                            size="icon"
                            onClick={(e) => handleToggleMenu(account._id, e)}
                            disabled={isDeleting && accountIdToDelete === account._id}
                            aria-label={`Actions for account ${account.accountNumber}`}
                             // --- Use final className ---
                            className="rounded-full focus:ring-2 focus:ring-offset-1 focus:ring-blue-500" // Keep rounding, add focus style
                            data-menu-button-for={account._id}
                        >
                            {isDeleting && accountIdToDelete === account._id ? (
                                <Spinner size="xs" />
                            ) : (
                                // SVG Icon (should inherit text-gray-900 from secondary variant)
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            )}
                        </Button>

                        {/* Conditionally Rendered Dropdown Menu (keep as is) */}
                        {openMenuAccountId === account._id && (
                            <div ref={menuRef} className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1">
                                {/* Menu items ... */}
                                <button onClick={() => openRenameModal(account)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled={isDeleting}> Rename </button>
                                <button onClick={() => handleViewTransactions(account._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled={isDeleting}> View Transactions </button>
                                <button onClick={() => handleGenerateStatement(account._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50" disabled={isDeleting}> Generate Statement </button>
                                <div className="border-t my-1 border-gray-100"></div>
                                <button onClick={() => handleDeleteConfirm(account)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50" disabled={isDeleting || (account.balance && account.balance.toString() !== '0.00')} title={account.balance && account.balance.toString() !== '0.00' ? 'Balance must be zero' : ''}> Delete Account... </button>
                            </div>
                        )}
                    </div> {/* End Actions Button Container */}
                </Card>
            ))}

             {/* Rename Modal */}
             {isRenaming && accountToRename && (
                 <RenameAccountModal
                     isOpen={isRenaming}
                     onClose={closeRenameModal}
                     account={accountToRename}
                     onSave={handleRenameSave}
                     apiError={renameApiError}
                 />
             )}
        </div>
    );
};

export default AccountList;