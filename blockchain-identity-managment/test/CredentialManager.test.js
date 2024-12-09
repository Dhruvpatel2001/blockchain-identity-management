const Web3 = require("web3");
const assert = require("chai").assert;
const artifacts = require("truffle-assertions");
const CredentialManager = artifacts.require("CredentialManager");

contract("CredentialManager", (accounts) => {
    let contract;
    const [deployer, user1, user2] = accounts;

    before(async () => {
        contract = await CredentialManager.deployed();
    });

    it("should deploy the contract", async () => {
        assert.ok(contract.address, "Contract should have a valid address.");
    });

    it("should issue credential to a user", async () => {
        const result = await contract.issueCredential(user1, "CredentialData", { from: deployer });
        const event = result.logs[0];
        assert.equal(event.event, "CredentialIssued", "CredentialIssued event should be emitted.");
        assert.equal(event.args.user, user1, "User should be the recipient of the credential.");
    });

    it("should not allow non-deployer to issue credentials", async () => {
        try {
            await contract.issueCredential(user1, "CredentialData", { from: user2 });
            assert.fail("Only deployer should be able to issue credentials");
        } catch (error) {
            assert(error.message.includes("revert"), "Error should contain 'revert'");
        }
    });

    it("should verify the credential", async () => {
        await contract.issueCredential(user1, "CredentialData", { from: deployer });
        const isVerified = await contract.verifyCredential(user1, "CredentialData");
        assert.equal(isVerified, true, "Credential should be verified successfully.");
    });
});
