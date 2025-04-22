// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    enum TransactionType { Buy, Rent, Exchange }

    struct ExchangeData {
        string initiatorCode;
        string receiverCode;
    }

    struct Transaction {
        address user;
        uint256 courseId;
        TransactionType transactionType;
        uint256 amount;
        string rentalDuration; // Only for Rent transactions
        ExchangeData exchangeData; // Only for Exchange transactions
        uint256 timestamp;
    }

    mapping(uint256 => Transaction) public transactions; // Transaction ID => Transaction
    uint256 public transactionCounter;

    event TransactionCreated(
        uint256 indexed transactionId,
        address indexed user,
        uint256 courseId,
        TransactionType transactionType,
        uint256 amount,
        string rentalDuration,
        ExchangeData exchangeData,
        uint256 timestamp
    );

    function createTransaction(
        uint256 courseId,
        TransactionType transactionType,
        uint256 amount,
        string memory rentalDuration,
        string memory initiatorCode,
        string memory receiverCode
    ) public {
        transactionCounter++;
        transactions[transactionCounter] = Transaction(
            msg.sender,
            courseId,
            transactionType,
            amount,
            rentalDuration,
            ExchangeData(initiatorCode, receiverCode),
            block.timestamp
        );

        emit TransactionCreated(
            transactionCounter,
            msg.sender,
            courseId,
            transactionType,
            amount,
            rentalDuration,
            ExchangeData(initiatorCode, receiverCode),
            block.timestamp
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
