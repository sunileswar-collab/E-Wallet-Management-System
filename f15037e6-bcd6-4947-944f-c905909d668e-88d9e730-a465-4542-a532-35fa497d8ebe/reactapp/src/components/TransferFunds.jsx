import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferFunds, getWallets } from '../utils/api';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Send,
  AccountBalanceWallet,
  SwapHoriz,
  CheckCircle,
  ArrowBack,
  Person,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const steps = ['Select Recipient', 'Enter Amount', 'Confirm Transfer'];

const TransferFunds = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentBalance] = useState(2500.00); // Mock balance

  const handleNext = () => {
    if (activeStep === 0 && !recipientPhone) {
      setError('Please enter recipient phone number');
      return;
    }
    if (activeStep === 1 && (!amount || parseFloat(amount) <= 0)) {
      setError('Please enter a valid amount');
      return;
    }
    if (activeStep === 1 && parseFloat(amount) > currentBalance) {
      setError('Insufficient balance');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      await transferFunds({
        recipientPhone,
        amount: parseFloat(amount),
        note
      });
      setSuccess(true);
    } catch (err) {
      setError('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Who are you sending to?
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Recipient Phone Number"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Enter phone number"
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
                  <Chip
                    key={index}
                    label={name}
                    onClick={() => setRecipientPhone(`+1234567890${index}`)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        );
      case 1:
        return (
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  How much to send?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available balance: ${currentBalance.toFixed(2)}
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 0.01, step: 0.01 }}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Note (Optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                multiline
                rows={2}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                {[10, 25, 50, 100].map((preset) => (
                  <Chip
                    key={preset}
                    label={`$${preset}`}
                    onClick={() => setAmount(preset.toString())}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </CardContent>
          </MotionCard>
        );
      case 2:
        return (
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircle sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Confirm Transfer
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>To:</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{recipientPhone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Amount:</Typography>
                  <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ${parseFloat(amount || 0).toFixed(2)}
                  </Typography>
                </Box>
                {note && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Note:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{note}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600 }}>Total:</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: 'primary.main' }}>
                    ${parseFloat(amount || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </MotionCard>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Transfer Complete
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                Transfer Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                ${parseFloat(amount).toFixed(2)} sent to {recipientPhone}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ mr: 2 }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/transactions')}
              >
                View History
              </Button>
            </Paper>
          </motion.div>
        </Container>
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
          <Send sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Send Money
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ p: 4 }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleTransfer : handleNext}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {activeStep === steps.length - 1 ? 'Send Money' : 'Next'}
            </Button>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default TransferFunds;
