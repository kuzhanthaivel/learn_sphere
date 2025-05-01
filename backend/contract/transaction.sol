// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    enum TransactionType { Buy, Rent, Exchange }
    enum PaymentMethod { Money, Coins } 

    struct Transaction {
        uint256 transactionId;
        address user;
        uint256 timestamp;
        string courseName;
        string courseCategory;
        TransactionType transactionType;
        PaymentMethod paymentMethod;
        uint256 amount; 
        uint256 exchangeId;
    }

    mapping(uint256 => Transaction) public transactions; 
    uint256 public transactionCounter;

    event TransactionCreated(
        uint256 indexed transactionId,
        address indexed user,
        uint256 timestamp,
        string courseName,
        string courseCategory,
        TransactionType transactionType,
        PaymentMethod paymentMethod,
        uint256 amount,
        uint256 exchangeId
    );

    function createTransaction(
        string memory courseName,
        string memory courseCategory,
        TransactionType transactionType,
        PaymentMethod paymentMethod,
        uint256 amount,
        uint256 exchangeId
    ) public {
        transactionCounter++;
        transactions[transactionCounter] = Transaction(
            transactionCounter,
            msg.sender,
            block.timestamp,
            courseName,
            courseCategory,
            transactionType,
            paymentMethod,
            amount,
            exchangeId
        );

        emit TransactionCreated(
            transactionCounter,
            msg.sender,
            block.timestamp,
            courseName,
            courseCategory,
            transactionType,
            paymentMethod,
            amount,
            exchangeId
        );
    }

    function getTransactionsByAddress(address user) public view returns (Transaction[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].user == user) {
                count++;
            }
        }

        Transaction[] memory result = new Transaction[](count);
        uint256 index;

        for (uint256 i = 1; i <= transactionCounter; i++) {
            if (transactions[i].user == user) {
                result[index] = transactions[i];
                index++;
            }
        }

        return result;
    }
}