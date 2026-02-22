import React from 'react';

const WalletDetails = ({ wallet }) => {
  if (!wallet) return <div>Select a wallet</div>;
  return (
    <div>
      <h2>Wallet Details</h2>
      <p>Name: {wallet.walletName}</p>
      <p>Balance: {wallet.balance}</p>
    </div>
  );
};

export default WalletDetails;
