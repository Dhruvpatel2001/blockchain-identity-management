// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserCredential {
    struct Credential {
        string credentialType;
        uint256 issuedAt;
        bool isActive;
    }
    
    mapping(address => Credential[]) public userCredentials;

    event CredentialIssued(address indexed user, string credentialType, uint256 issuedAt);
    
    function issueCredential(address user, string memory credentialType) public {
        Credential memory newCredential = Credential({
            credentialType: credentialType,
            issuedAt: block.timestamp,
            isActive: true
        });
        userCredentials[user].push(newCredential);
        emit CredentialIssued(user, credentialType, block.timestamp);
    }

    function verifyCredential(address user, uint256 index) public view returns (bool) {
        require(index < userCredentials[user].length, "Credential does not exist");
        return userCredentials[user][index].isActive;
    }
}


