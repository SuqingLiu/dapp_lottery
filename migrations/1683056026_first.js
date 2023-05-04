



const MOKToken = artifacts.require("MOKToken");
const Lottery = artifacts.require("Lottery");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(MOKToken, 10000, { from: accounts[0] })
    .then((mokTokenInstance) => {
      return deployer.deploy(Lottery, mokTokenInstance.address, accounts[1], 20, 300);
    });
};
