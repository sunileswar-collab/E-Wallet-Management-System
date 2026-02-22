import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../utils/api';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  History,
  ArrowBack,
  Search,
  AccountBalanceWallet,
  FilterList,
  Download,
  Send,
  CallReceived,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState(null);

  // Mock transaction data
  const mockTransactions = [
    {
      transactionId: '1',
      transactionDate: new Date().toISOString(),
      transactionType: 'SEND',
      amount: 150.00,
      transactionStatus: 'COMPLETED',
      recipient: 'John Doe',
      description: 'Dinner payment'
    },
    {
      transactionId: '2',
      transactionDate: new Date(Date.now() - 86400000).toISOString(),
      transactionType: 'RECEIVE',
      amount: 75.50,
      transactionStatus: 'COMPLETED',
      recipient: 'Jane Smith',
      description: 'Shared taxi fare'
    },
    {
      transactionId: '3',
      transactionDate: new Date(Date.now() - 172800000).toISOString(),
      transactionType: 'TOP_UP',
      amount: 500.00,
      transactionStatus: 'COMPLETED',
      recipient: 'Bank Transfer',
      description: 'Wallet top-up'
    },
    {
      transactionId: '4',
      transactionDate: new Date(Date.now() - 259200000).toISOString(),
      transactionType: 'SEND',
      amount: 25.00,
      transactionStatus: 'PENDING',
      recipient: 'Mike Johnson',
      description: 'Coffee payment'
    }
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (err) {
        console.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (tabValue === 1) {
      filtered = filtered.filter(t => t.transactionType === 'SEND');
    } else if (tabValue === 2) {
      filtered = filtered.filter(t => t.transactionType === 'RECEIVE');
    }
    
    setFilteredTransactions(filtered);
  }, [searchTerm, tabValue, transactions]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'SEND':
        return <Send sx={{ color: 'error.main' }} />;
      case 'RECEIVE':
        return <CallReceived sx={{ color: 'success.main' }} />;
      case 'TOP_UP':
        return <AccountBalanceWallet sx={{ color: 'primary.main' }} />;
      default:
        return <AccountBalanceWallet />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount, type) => {
    const sign = type === 'SEND' ? '-' : '+';
    return `${sign}$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <History sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Transaction History
          </Typography>
          <IconButton color="inherit" onClick={(e) => setFilterAnchor(e.currentTarget)}>
            <FilterList />
          </IconButton>
          <IconButton color="inherit">
            <Download />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <MotionCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: 3 }}
        >
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="All" />
              <Tab label="Sent" />
              <Tab label="Received" />
            </Tabs>
          </CardContent>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{ mb: 3 }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              This Month Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  +$575.50
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Received
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                  -$175.00
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sent
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardContent sx={{ p: 0 }}>
            {filteredTransactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <History sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No transactions found
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.transactionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem sx={{ py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'background.paper' }}>
                          {getTransactionIcon(transaction.transactionType)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {transaction.recipient}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color: transaction.transactionType === 'SEND' ? 'error.main' : 'success.main'
                              }}
                            >
                              {formatAmount(transaction.amount, transaction.transactionType)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                label={transaction.transactionStatus}
                                size="small"
                                color={getStatusColor(transaction.transactionStatus)}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(transaction.transactionDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredTransactions.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </List>
            )}
          </CardContent>
        </MotionCard>
      </Container>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        <MenuItem onClick={() => setFilterAnchor(null)}>Last 7 days</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>Last 30 days</MenuItem>
        <MenuItem onClick={() => setFilterAnchor(null)}>Last 3 months</MenuItem>
      </Menu>
    </Box>
  );
};

export default TransactionHistory;