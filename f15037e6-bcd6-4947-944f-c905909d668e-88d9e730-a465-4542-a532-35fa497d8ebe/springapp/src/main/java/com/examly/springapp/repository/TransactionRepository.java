package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Wallet;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findBySenderWalletOrReceiverWalletOrderByTimestampDesc(Wallet senderWallet, Wallet receiverWallet);
    List<Transaction> findAllByOrderByTimestampDesc();
    default List<Transaction> findBySourceWalletOrDestinationWalletOrderByTimestampDesc(Wallet sourceWallet, Wallet destinationWallet) {
        return findBySenderWalletOrReceiverWalletOrderByTimestampDesc(sourceWallet, destinationWallet);
    }
}

