import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../utils/api';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterInput, setFilterInput] = useState('');

  const fetchTransactions = async () => {
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDir,
        filterBy: filterBy || undefined,
        filterValue: filterValue || undefined,
      };
      const data = await getAllTransactions(params);
      setTransactions(data.content);
      setTotalPages(data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, sortBy, sortDir, filterBy, filterValue]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleFilterApply = () => {
    setFilterBy('type');
    setFilterValue(filterInput);
    setPage(0);
  };

  const handleFilterClear = () => {
    setFilterBy('');
    setFilterValue('');
    setFilterInput('');
    setPage(0);
  };

  return (
    <div className="transactions-container">
      <h2>Transaction History</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <input
          type="text"
          placeholder="Filter by type (e.g., TRANSFER)"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <button onClick={handleFilterApply}>Apply Filter</button>
        <button onClick={handleFilterClear}>Clear Filter</button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('transactionId')}>
              ID {sortBy === 'transactionId' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('fromWalletId')}>
              From Wallet {sortBy === 'fromWalletId' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('toWalletId')}>
              To Wallet {sortBy === 'toWalletId' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('amount')}>
              Amount {sortBy === 'amount' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('timestamp')}>
              Date {sortBy === 'timestamp' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.transactionId}>
                <td>{tx.transactionId}</td>
                <td>{tx.fromWalletId}</td>
                <td>{tx.toWalletId}</td>
                <td>{tx.amount}</td>
                <td>{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span> Page {page + 1} of {totalPages} </span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Transactions;
