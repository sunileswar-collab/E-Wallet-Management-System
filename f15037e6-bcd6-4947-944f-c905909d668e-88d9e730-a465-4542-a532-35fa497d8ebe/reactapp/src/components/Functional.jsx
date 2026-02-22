import React, { useState } from 'react';
import UserForm from './UserForm';
import WalletForm from './WalletForm';
import DepositForm from './DepositForm';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import UserList from './UserList';
import WalletList from './WalletList';
import WalletDetails from './WalletDetails';
import NavBar from './NavBar';

const Functional = () => {
  const [users, setUsers] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleUserCreated = (user) => {
    setUsers([...users, user]);
  };

  const handleWalletCreated = (wallet) => {
    setWallets([...wallets, wallet]);
  };

  const handleDeposit = (updatedWallet) => {
    setWallets(wallets.map(w =>
      w.walletId === updatedWallet.walletId ? updatedWallet : w
    ));
  };

  const handleTransfer = (transaction) => {
    console.log('Transfer completed:', transaction);
  };

  return (
    <div className="App">
      <NavBar />
      <h1>E-Wallet Management System</h1>

      <div className="forms-section">
        <UserForm onUserCreated={handleUserCreated} />
        <WalletForm users={users} onWalletCreated={handleWalletCreated} />
        <DepositForm wallets={wallets} onDeposit={handleDeposit} />
        <TransferForm wallets={wallets} onTransfer={handleTransfer} />
      </div>

      <div className="lists-section">
        <UserList users={users} />
        <WalletList wallets={wallets} />
        <WalletDetails wallet={selectedWallet} />
        <TransactionHistory walletId={selectedWallet?.walletId} />
      </div>
    </div>
  );
};

export default Functional;
