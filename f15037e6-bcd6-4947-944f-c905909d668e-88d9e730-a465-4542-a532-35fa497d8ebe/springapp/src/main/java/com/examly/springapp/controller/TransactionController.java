package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserTransactions(@RequestParam String email) {
        List<Transaction> transactions = transactionService.getUserTransactions(email);
        
        List<Map<String, Object>> response = transactions.stream().map(tx -> {
            Map<String, Object> txMap = Map.of(
                "transactionId", tx.getTransactionId(),
                "amount", tx.getAmount(),
                "type", tx.getType().name(),
                "status", tx.getStatus().name(),
                "timestamp", tx.getTimestamp(),
                "description", tx.getDescription() != null ? tx.getDescription() : "",
                "senderEmail", tx.getSenderWallet() != null ? tx.getSenderWallet().getUser().getEmail() : null,
                "receiverEmail", tx.getReceiverWallet() != null ? tx.getReceiverWallet().getUser().getEmail() : null
            );
            return txMap;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}
