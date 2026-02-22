import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { depositFunds } from '../utils/api';

const DepositForm = ({ wallets, onDeposit }) => {
 const { register, handleSubmit, formState: { errors }, reset } = useForm();
 const [success, setSuccess] = useState('');
 const [error, setError] = useState('');

 useEffect(() => {
  setError(errors.walletId?.message || errors.amount?.message || '');
 }, [errors]);

 const onSubmit = async (data) => {
  setSuccess('');
  setError('');
  try {
   const response = await depositFunds(data);
   setSuccess('deposit successful');
   reset();
   if (onDeposit) {
    onDeposit(response);
   }
  } catch (err) {
   setError('Deposit failed');
  }
 };

 return (
  <div data-testid="deposit-form">
   <h2>Deposit Funds</h2>
   <form onSubmit={handleSubmit(onSubmit)}>
    <div>
     <label htmlFor="walletId">wallet</label>
     <select
      id="walletId"
      {...register('walletId', { required: 'wallet must be selected' })}
      data-testid="wallet-select"
     >
      <option value="">Select a wallet</option>
      {wallets.map(wallet => (
       <option key={wallet.walletId} value={wallet.walletId}>{wallet.walletName}</option>
      ))}
     </select>
    </div>
    <div>
     <label htmlFor="amount">amount</label>
     <input
      id="amount"
      type="number"
      step="0.01"
      {...register('amount', {
       required: 'Amount is required',
       min: { value: 0.01, message: 'Amount must be greater than 0' }
      })}
      data-testid="deposit-amount-input"
     />
    </div>
    <button type="submit">deposit</button>
   </form>
   {error && <div data-testid="deposit-form-error">{error}</div>}
   {success && <div data-testid="deposit-form-success">{success}</div>}
  </div>
 );
};

export default DepositForm;

