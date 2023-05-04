const MOKToken = artifacts.require("MOKToken");
const Lottery = artifacts.require("Lottery");

module.exports = async function (deployer, network, accounts) {
  const gasLimit = 8000000; // increase this value as needed
  await deployer.deploy(MOKToken, 10000, { from: accounts[0], gas: gasLimit });
  const mokTokenInstance = await MOKToken.deployed();
  await deployer.deploy(Lottery, mokTokenInstance.address, accounts[1], 20, 300, { from: accounts[0], gas: gasLimit });
};