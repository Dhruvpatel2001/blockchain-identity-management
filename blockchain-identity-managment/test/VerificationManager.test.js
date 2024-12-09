const Web3 = require("web3");
const assert = require("chai").assert;
const artifacts = require("truffle-assertions");
const VerificationManager = artifacts.require("VerificationManager");

contract("VerificationManager", (accounts) => {
    let contract;
    const [deployer, user1] = accounts;

    before(async () => {
        contract = await VerificationManager.deployed();
    });

    it("should deploy the contract", async () => {
        assert.ok(contract.address, "Contract should have a valid address.");
    });

    it("should create a verification request", async () => {
        const result = await contract.createVerificationRequest(user1, "VerificationData", { from: deployer });
        const event = result.logs[0];
        assert.equal(event.event, "VerificationRequestCreated", "VerificationRequestCreated event should be emitted.");
        assert.equal(event.args.user, user1, "User should be the one requesting verification.");
    });

    it("should approve verification request", async () => {
        const result = await contract.createVerificationRequest(user1, "VerificationData", { from: deployer });
        await contract.approveVerificationRequest(result.logs[0].args.requestId, { from: deployer });
        const request = await contract.verificationRequests(result.logs[0].args.requestId);
        assert.equal(request.status, "Approved", "Verification request should be approved.");
    });

    it("should reject verification request", async () => {
        const result = await contract.createVerificationRequest(user1, "VerificationData", { from: deployer });
        await contract.rejectVerificationRequest(result.logs[0].args.requestId, { from: deployer });
        const request = await contract.verificationRequests(result.logs[0].args.requestId);
        assert.equal(request.status, "Rejected", "Verification request should be rejected.");
    });
});
