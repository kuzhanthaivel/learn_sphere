// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificates {
    struct Certificate {
        address student;
        uint256 courseId;
        string certificateHash; // Change this to metadata link (e.g., IPFS)
        uint256 issuedAt;
    }

    mapping(bytes32 => Certificate) public certificates; 
    bytes32[] public certificateIds;

    event CertificateIssued(
        bytes32 indexed certificateId,
        address indexed student,
        uint256 courseId,
        string certificateHash,
        uint256 issuedAt
    );

    function issueCertificate(
        address student,
        uint256 courseId,
        string memory certificateHash
    ) public returns (bytes32) {
        bytes32 certificateId = keccak256(abi.encodePacked(student, courseId, block.timestamp));
        certificates[certificateId] = Certificate(student, courseId, certificateHash, block.timestamp);
        certificateIds.push(certificateId);

        emit CertificateIssued(certificateId, student, courseId, certificateHash, block.timestamp);

        return certificateId;
    }

    function viewCertificatesByAddress(address student) public view returns (Certificate[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < certificateIds.length; i++) {
            if (certificates[certificateIds[i]].student == student) {
                count++;
            }
        }


        Certificate[] memory result = new Certificate[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < certificateIds.length; i++) {
            if (certificates[certificateIds[i]].student == student) {
                result[index] = certificates[certificateIds[i]];
                index++;
            }
        }

        return result;
    }

    function viewCertificateById(bytes32 certificateId) public view returns (Certificate memory) {
        require(certificates[certificateId].student != address(0), "Certificate does not exist");
        return certificates[certificateId];
    }
}
