import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Fade,
  Grow,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  Security,
  Speed,
  Login as LoginIcon,
  PersonAdd,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFeatures(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Digital Wallet',
      description: 'Secure and convenient digital wallet management'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Real-time Analytics',
      description: 'Track your spending and income with detailed analytics'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Bank-level Security',
      description: 'Your money is protected with enterprise-grade security'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      title: 'Instant Transfers',
      description: 'Send and receive money instantly with zero delays'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'text.primary' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            💳 E-Wallet Pro
          </Typography>
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Your Digital Wallet,
              <br />Reimagined
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Experience the future of digital payments with our secure, fast, and intelligent e-wallet platform
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Features Section */}
        <Fade in={showFeatures} timeout={1000}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 600 }}
            >
              Why Choose E-Wallet Pro?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Grow in={showFeatures} timeout={1000 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8]
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                  10K+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Active Users
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h3" color="secondary" sx={{ fontWeight: 700 }}>
                  $2M+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Transactions Processed
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                  99.9%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Uptime Guarantee
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;