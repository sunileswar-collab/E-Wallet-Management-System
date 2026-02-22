import React, { useState } from 'react';
import { createWallet } from '../utils/api';

const WalletForm = ({ users, onWalletCreated }) => {
  const [userId, setUserId] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('User must be selected');
      return;
    }
    if (!walletName) {
      setError('Wallet name is required');
      return;
    }
    try {
      const wallet = await createWallet({ userId, walletName });
      onWalletCreated(wallet);
      setSuccess('wallet created');
      setUserId('');
      setWalletName('');
      setError('');
    } catch (err) {
      setError('Failed to create wallet');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="user-select">user</label>
      <select id="user-select" data-testid="user-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">Select User</option>
        {users.map(user => <option key={user.userId} value={user.userId}>{user.username}</option>)}
      </select>
      <label htmlFor="wallet-name-input">wallet name</label>
      <input id="wallet-name-input" data-testid="wallet-name-input" value={walletName} onChange={(e) => setWalletName(e.target.value)} />
      <button type="submit">create wallet</button>
      {error && <div data-testid="wallet-form-error">{error}</div>}
      {success && <div data-testid="wallet-form-success">{success}</div>}
    </form>
  );
};

export default WalletForm;
