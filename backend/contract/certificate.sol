// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificates {
    struct Certificate {
        bytes32 _id;
        address user;
        string userName;
        string certificateId;
        string courseName;
        string courseCategory;
        uint256 completedAt;
        string creatorName;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(string => bytes32) public certificateIdTo_hash; 
    mapping(string => bool) public isCertificateIdUsed;

    event CertificateIssued(
        bytes32 indexed _id,
        address indexed user,
        string userName,
        string certificateId,
        string courseName,
        string courseCategory,
        uint256 completedAt,
        string creatorName
    );

    function createCertificate(
        address user,
        string memory userName,
        string memory certificateId,
        string memory courseName,
        string memory courseCategory,
        string memory creatorName
    ) public {
        require(!isCertificateIdUsed[certificateId], "Certificate ID already used");
        
        bytes32 _id = keccak256(abi.encodePacked(user, certificateId, block.timestamp));
        
        certificates[_id] = Certificate(
            _id,
            user,
            userName,
            certificateId,
            courseName,
            courseCategory,
            block.timestamp,
            creatorName
        );

        certificateIdTo_hash[certificateId] = _id;
        isCertificateIdUsed[certificateId] = true;

        emit CertificateIssued(
            _id,
            user,
            userName,
            certificateId,
            courseName,
            courseCategory,
            block.timestamp,
            creatorName
        );
    }

    function viewCertificateById(string memory certificateId) public view returns (Certificate memory) {
        require(isCertificateIdUsed[certificateId], "Certificate does not exist");
        bytes32 _id = certificateIdTo_hash[certificateId];
        return certificates[_id];
    }
}