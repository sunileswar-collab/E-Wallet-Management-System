package com.examly.springapp.service;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.repository.TransactionRepository;
import com.examly.springapp.repository.WalletRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private WalletRepository walletRepository;

    public List<Transaction> getUserTransactions(String userEmail) {
        Wallet wallet = walletRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userEmail));
        return transactionRepository.findBySenderWalletOrReceiverWalletOrderByTimestampDesc(wallet, wallet);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc();
    }
    
    public Transaction getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));
    }
    
    public List<Transaction> getTransactionsByWallet(Long walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found with id: " + walletId));
        return transactionRepository.findBySourceWalletOrDestinationWalletOrderByTimestampDesc(wallet, wallet);
    }
}
