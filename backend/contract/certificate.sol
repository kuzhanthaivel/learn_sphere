// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Certificate {
        address user;
        string userName;
        string profileImage;
        string courseTitle;
        string courseCategory;
        string completionDate;
        string certificateId;
    }

    Certificate[] private certificates;

    event CertificateAdded(
        address indexed user,
        string userName,
        string profileImage,
        string courseTitle,
        string courseCategory,
        string completionDate,
        string certificateId
    );

    function addCertificate(
        address _user,
        string memory _userName,
        string memory _profileImage,
        string memory _courseTitle,
        string memory _courseCategory,
        string memory _completionDate,
        string memory _certificateId
    ) public {
        Certificate memory newCertificate = Certificate(
            _user,
            _userName,
            _profileImage,
            _courseTitle,
            _courseCategory,
            _completionDate,
            _certificateId
        );

        certificates.push(newCertificate);

        emit CertificateAdded(
            _user,
            _userName,
            _profileImage,
            _courseTitle,
            _courseCategory,
            _completionDate,
            _certificateId
        );
    }

    function getAllCertificates() public view returns (Certificate[] memory) {
        return certificates;
    }
}
