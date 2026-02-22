import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAllTransactions } from '../utils/api';
import './UserDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, transactionsResponse] = await Promise.all([
        getDashboardStats(),
        getAllTransactions()
      ]);
      setStats(statsResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>{stats.totalTransactions || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Volume</h3>
          <p>${stats.totalVolume?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        <div className="transactions-list">
          {transactions.slice(0, 10).map(tx => (
            <div key={tx.transactionId} className="transaction-item">
              <span>{tx.type}</span>
              <span>${tx.amount}</span>
              <span>{tx.status}</span>
              <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;