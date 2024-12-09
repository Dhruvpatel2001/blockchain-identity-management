// migrations/2_deploy_contracts.js
const UserRegistry = artifacts.require("UserRegistry");
const CredentialManager = artifacts.require("CredentialManager");
const VerificationManager = artifacts.require("VerificationManager");

// module.exports = function (deployer) {
//   deployer.deploy(UserRegistry)
//     .then(() => console.log("UserRegistry deployed successfully"))
//     .catch((err) => console.log("Error deploying UserRegistry:", err));
  
//   deployer.deploy(CredentialManager)
//     .then(() => console.log("CredentialManager deployed successfully"))
//     .catch((err) => console.log("Error deploying CredentialManager:", err));
  
//   deployer.deploy(VerificationManager)
//     .then(() => console.log("VerificationManager deployed successfully"))
//     .catch((err) => console.log("Error deploying VerificationManager:", err));
// };
module.exports = async function (deployer) {
  // Deploy UserRegistry contract
  await deployer.deploy(UserRegistry, { gas: 6000000 });

  // Deploy CredentialManager contract
  await deployer.deploy(CredentialManager, { gas: 6000000 });

  // Deploy VerificationManager contract
  await deployer.deploy(VerificationManager, { gas: 6000000 });
};
