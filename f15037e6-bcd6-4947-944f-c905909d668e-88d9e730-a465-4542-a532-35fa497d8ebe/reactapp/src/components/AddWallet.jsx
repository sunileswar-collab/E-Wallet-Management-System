import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AddWallet.css';

const AddWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!walletName.trim()) {
      setError('Wallet Name is required');
      return;
    }

    if (!user || !user.userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/wallets/${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletName }),
      });
      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }
      setSuccess('Wallet created successfully!');
      setTimeout(() => {
        navigate('/Transactions');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-wallet-container">
      <img
        src="/images/wallet-image.png"
        alt="Add Wallet"
        className="add-wallet-image"
      />
      <form className="add-wallet-form" onSubmit={handleSubmit}>
        <label htmlFor="walletName">Wallet Name*</label>
        <input
          id="walletName"
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Wallet'}
        </button>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default AddWallet;
