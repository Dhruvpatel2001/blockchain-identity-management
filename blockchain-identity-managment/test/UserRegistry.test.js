const Web3 = require("web3");
const assert = require("chai").assert;
const artifacts = require("truffle-assertions");
const UserRegistry = artifacts.require("UserRegistry");

contract("UserRegistry", (accounts) => {
    let contract;

    const [deployer, user1] = accounts;

    before(async () => {
        contract = await UserRegistry.deployed();
    });

    it("should deploy the contract", async () => {
        assert.ok(contract.address, "Contract should have a valid address.");
    });

    it("should register a new user", async () => {
        const result = await contract.registerUser("User 1", { from: user1 });
        const event = result.logs[0];
        assert.equal(event.event, "UserRegistered", "UserRegistered event should be emitted.");
        assert.equal(event.args.user, user1, "The registered user should be the sender.");
    });

    it("should not allow the same user to register twice", async () => {
        try {
            await contract.registerUser("User 1", { from: user1 });
            assert.fail("User should not be able to register twice.");
        } catch (error) {
            assert(error.message.includes("revert"), "Error should contain 'revert'");
        }
    });

    it("should get the user's name", async () => {
        await contract.registerUser("User 1", { from: user1 });
        const name = await contract.getUserName(user1);
        assert.equal(name, "User 1", "The user's name should be correct.");
    });
});

