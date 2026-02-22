    import React, { useState } from 'react';
    import { transferFunds } from '../utils/api';

    const TransferForm = ({ wallets, onTransfer }) => {
    const [sourceWalletId, setSourceWalletId] = useState('');
    const [destinationWalletId, setDestinationWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceWalletId) {
    setError('select source wallet');
    return;
    }
    if (!destinationWalletId) {
    setError('Select destination wallet');
    return;
    }
    if (!amount || amount <= 0) {
    setError('Enter valid amount');
    return;
    }
    try {
    const tx = await transferFunds({ sourceWalletId, destinationWalletId, amount });
    onTransfer(tx);
    setSuccess('transfer successful');
    setSourceWalletId('');
    setDestinationWalletId('');
    setAmount('');
    setError('');
    } catch (err) {
    setError('Failed to transfer');
    }
    };

    return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="source-wallet-select">source wallet</label>
    <select id="source-wallet-select" data-testid="source-wallet-select" value={sourceWalletId} onChange={(e) => setSourceWalletId(e.target.value)}>
        <option value="">Select Source Wallet</option>
        {wallets.map(wallet => <option key={wallet.walletId} value={wallet.walletId}>{wallet.walletName}</option>)}
    </select>
    <label htmlFor="destination-wallet-select">destination wallet</label>
    <select id="destination-wallet-select" data-testid="destination-wallet-select" value={destinationWalletId} onChange={(e) => setDestinationWalletId(e.target.value)}>
        <option value="">Select Destination Wallet</option>
        {wallets.map(wallet => <option key={wallet.walletId} value={wallet.walletId}>{wallet.walletName}</option>)}
    </select>
    <label htmlFor="transfer-amount-input">amount</label>
    <input id="transfer-amount-input" data-testid="transfer-amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
    <button type="submit">transfer</button>
    {error && <div data-testid="transfer-form-error">{error}</div>}
    {success && <div data-testid="transfer-form-success">{success}</div>}
    </form>
    );
    };

    export default TransferForm;

