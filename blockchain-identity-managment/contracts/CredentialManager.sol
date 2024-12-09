// contracts/CredentialManager.sol
pragma solidity ^0.8.0;

contract CredentialManager {
    struct Credential {
        address issuer;
        address holder;
        string credentialHash;
    }

    mapping(address => Credential[]) public credentials;

    event CredentialIssued(address issuer, address holder, string credentialHash);

    function issueCredential(address holder, string memory credentialHash) public {
        Credential memory newCredential = Credential(msg.sender, holder, credentialHash);
        credentials[holder].push(newCredential);
        emit CredentialIssued(msg.sender, holder, credentialHash);
    }
}
