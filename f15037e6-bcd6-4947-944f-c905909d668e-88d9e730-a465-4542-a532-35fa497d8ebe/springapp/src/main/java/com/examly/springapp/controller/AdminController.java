package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/transactions")
    public ResponseEntity<List<Map<String, Object>>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        
        List<Map<String, Object>> response = new ArrayList<>();
        for (Transaction tx : transactions) {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionId", tx.getTransactionId());
            map.put("amount", tx.getAmount());
            map.put("type", tx.getType().name());
            map.put("status", tx.getStatus().name());
            map.put("timestamp", tx.getTimestamp());
            map.put("description", tx.getDescription() != null ? tx.getDescription() : "");
            map.put("senderEmail", tx.getSenderWallet() != null ? tx.getSenderWallet().getUser().getEmail() : null);
            map.put("receiverEmail", tx.getReceiverWallet() != null ? tx.getReceiverWallet().getUser().getEmail() : null);
            response.add(map);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Transaction> allTransactions = transactionService.getAllTransactions();
        long totalUsers = userService.getAllUsers().size();
        
        long totalTransactions = allTransactions.size();
        double totalVolume = allTransactions.stream()
            .mapToDouble(tx -> tx.getAmount().doubleValue())
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalTransactions", totalTransactions);
        stats.put("totalVolume", totalVolume);
        
        return ResponseEntity.ok(stats);
    }
}