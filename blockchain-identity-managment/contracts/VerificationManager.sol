// contracts/VerificationManager.sol
pragma solidity ^0.8.0;

contract VerificationManager {
    address public admin; // Add admin role for secure approvals

    struct VerificationRequest {
        address verifier;
        address holder;
        bool isApproved;
    }

    mapping(address => VerificationRequest[]) public verificationRequests;

    event VerificationRequested(address verifier, address holder);
    event VerificationApproved(address holder, address verifier);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can approve verification");
        _;
    }

    modifier onlyHolder(address holder) {
        require(msg.sender == holder, "Only the holder can approve.");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the admin to the contract deployer
    }

    function requestVerification(address holder) public {
        verificationRequests[holder].push(VerificationRequest(msg.sender, holder, false));
        emit VerificationRequested(msg.sender, holder);
    }

    function approveVerification(uint index) public onlyHolder(msg.sender) {
        VerificationRequest storage request = verificationRequests[msg.sender][index];
        request.isApproved = true;
        emit VerificationApproved(msg.sender, request.verifier);
    }

    function approveVerificationByAdmin(uint index) public onlyAdmin {
        VerificationRequest storage request = verificationRequests[msg.sender][index];
        request.isApproved = true;
        emit VerificationApproved(msg.sender, request.verifier);
    }
}

