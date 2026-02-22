package com.examly.springapp.service;

import com.examly.springapp.model.Wallet;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Transaction.TransactionType;
import com.examly.springapp.model.Transaction.TransactionStatus;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;

    public Wallet getUserWallet(String userEmail) {
        return walletRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userEmail));
    }
    
    public Wallet getUserWalletById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user"));
    }

    public Wallet topUpWallet(String userEmail, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }
        
        Wallet wallet = getUserWallet(userEmail);
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setReceiverWallet(wallet);
        transaction.setAmount(amount);
        transaction.setType(TransactionType.TOP_UP);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setDescription("Wallet top-up");
        transactionRepository.save(transaction);

        return wallet;
    }

    public Transaction transferFunds(String senderEmail, String receiverEmail, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }
        
        if (senderEmail.equals(receiverEmail)) {
            throw new BadRequestException("Cannot transfer to the same account");
        }
        
        Wallet senderWallet = getUserWallet(senderEmail);
        Wallet receiverWallet = getUserWallet(receiverEmail);

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient balance");
        }

        // Perform transfer
        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
        
        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setSenderWallet(senderWallet);
        transaction.setReceiverWallet(receiverWallet);
        transaction.setAmount(amount);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setDescription("Fund transfer from " + senderEmail + " to " + receiverEmail);
        
        return transactionRepository.save(transaction);
    }
    
    public Wallet createWallet(Long userId, String walletName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Wallet wallet = new Wallet(user);
        wallet.setWalletName(walletName);
        return walletRepository.save(wallet);
    }
    
    public Wallet deposit(Long walletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }
        
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found with id: " + walletId));
        
        wallet.setBalance(wallet.getBalance().add(amount));
        return walletRepository.save(wallet);
    }
    
    public Transaction transfer(Long sourceWalletId, Long destinationWalletId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0");
        }
        
        Wallet sourceWallet = walletRepository.findById(sourceWalletId)
                .orElseThrow(() -> new ResourceNotFoundException("Source wallet not found"));
        Wallet destinationWallet = walletRepository.findById(destinationWalletId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination wallet not found"));
        
        if (sourceWallet.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient balance");
        }
        
        sourceWallet.setBalance(sourceWallet.getBalance().subtract(amount));
        destinationWallet.setBalance(destinationWallet.getBalance().add(amount));
        
        walletRepository.save(sourceWallet);
        walletRepository.save(destinationWallet);
        
        Transaction transaction = new Transaction();
        transaction.setSourceWallet(sourceWallet);
        transaction.setDestinationWallet(destinationWallet);
        transaction.setAmount(amount);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.SUCCESS);
        
        return transactionRepository.save(transaction);
    }
}
