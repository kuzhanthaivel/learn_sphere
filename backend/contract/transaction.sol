// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentDetails {

    struct Payment {
        string transactionId; 
        address user;
        string timestamp; 
        string courseName;
        string courseCategory;  
        string transactionType;
        string paymentMethod;
        string amount; 
        string exchangeId; 
    }

    Payment[] private payments;

    event PaymentAdded(
        string transactionId, 
        address indexed user,
        string timestamp,
        string courseName,
        string courseCategory,
        string transactionType,
        string paymentMethod,
        string amount, 
        string exchangeId 
    );

    function addPayment(
        string memory _transactionId,
        address _user,
        string memory _timestamp,
        string memory _courseName,
        string memory _courseCategory,
        string memory _transactionType,
        string memory _paymentMethod,
        string memory _amount,
        string memory _exchangeId 
    ) public {
        Payment memory newPayment = Payment(
            _transactionId,
            _user,
            _timestamp,
            _courseName,
            _courseCategory,
            _transactionType,
            _paymentMethod,
            _amount,
            _exchangeId
        );

        payments.push(newPayment);

        emit PaymentAdded(
            _transactionId,
            _user,
            _timestamp,
            _courseName,
            _courseCategory,
            _transactionType,
            _paymentMethod,
            _amount,
            _exchangeId
        );
    }

    function getAllPayments() public view returns (Payment[] memory) {
        return payments;
    }
}
