package com.examly.springapp.controller;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;
import com.examly.springapp.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    
    @Autowired
    private WalletService walletService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWallet(@RequestParam String email) {
        Wallet wallet = walletService.getUserWallet(email);
        
        return ResponseEntity.ok(Map.of(
            "walletId", wallet.getWalletId(),
            "balance", wallet.getBalance()
        ));
    }

    @PostMapping("/top-up")
    public ResponseEntity<Map<String, Object>> topUpWallet(@RequestBody Map<String, Object> request) {
        String userEmail = request.get("email").toString();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        Wallet wallet = walletService.topUpWallet(userEmail, amount);
        
        return ResponseEntity.ok(Map.of(
            "message", "Wallet topped up successfully",
            "balance", wallet.getBalance()
        ));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transferFunds(@RequestBody Map<String, Object> request) {
        String senderEmail = request.get("senderEmail").toString();
        String receiverEmail = request.get("receiverEmail").toString();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        Transaction transaction = walletService.transferFunds(senderEmail, receiverEmail, amount);
        
        return ResponseEntity.ok(Map.of(
            "message", "Transfer completed successfully",
            "transactionId", transaction.getTransactionId()
        ));
    }
}
