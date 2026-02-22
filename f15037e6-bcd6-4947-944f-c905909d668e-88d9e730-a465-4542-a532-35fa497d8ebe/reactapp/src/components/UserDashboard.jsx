import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Fab,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  Send,
  History,
  Add,
  AccountCircle,
  Logout,
  Notifications,
  Dashboard,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const chartData = useMemo(() => [
    { name: 'Jan', balance: 1200 },
    { name: 'Feb', balance: 1900 },
    { name: 'Mar', balance: 1500 },
    { name: 'Apr', balance: 2200 },
    { name: 'May', balance: 1800 },
    { name: 'Jun', balance: 2500 },
  ], []);

  const expenseData = useMemo(() => [
    { name: 'Food', value: 400, color: '#8884d8' },
    { name: 'Transport', value: 300, color: '#82ca9d' },
    { name: 'Shopping', value: 200, color: '#ffc658' },
    { name: 'Bills', value: 100, color: '#ff7300' },
  ], []);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = useCallback(async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      showNotification('Error loading wallet data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  const handleTopUp = useCallback(async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    try {
      const response = await api.post('/wallet/top-up', {
        amount: parseFloat(topUpAmount)
      });
      setWallet(prev => ({ ...prev, balance: response.data.balance }));
      setTopUpAmount('');
      setShowTopUpDialog(false);
      showNotification('Wallet topped up successfully!', 'success');
    } catch (error) {
      console.error('Error topping up wallet:', error);
      showNotification('Error topping up wallet', 'error');
    }
  }, [topUpAmount]);

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);

  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <AccountCircle sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 4 }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Welcome back, {user?.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's what's happening with your wallet today
              </Typography>
            </Box>
          </Box>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Current Balance
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${wallet?.balance?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                  <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      This Month
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      +$1,234
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Transactions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {transactions.length}
                    </Typography>
                  </Box>
                  <History sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Saved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      $567
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'secondary.main' }} />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Balance Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="balance" stroke={theme.palette.primary.main} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Expense Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setShowTopUpDialog(true)}
                sx={{ py: 2 }}
              >
                Top Up Wallet
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Send />}
                onClick={() => navigate('/transfer')}
                sx={{ py: 2 }}
              >
                Send Money
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<History />}
                onClick={() => navigate('/transactions')}
                sx={{ py: 2 }}
              >
                View History
              </Button>
            </Grid>
          </Grid>
        </MotionBox>
      </Container>

      {/* Top Up Dialog */}
      <Dialog open={showTopUpDialog} onClose={() => setShowTopUpDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Top Up Your Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount ($)"
            type="number"
            fullWidth
            variant="outlined"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            inputProps={{ min: 0.01, step: 0.01 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTopUpDialog(false)}>Cancel</Button>
          <Button onClick={handleTopUp} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDashboard;