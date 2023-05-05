const { ethers, upgrades } = require("hardhat");

const newAccountAddress = "0x1D0D7cDe21A36707716c676E3c4d878dFAB1cd76";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MOKToken
  const MOKToken = await ethers.getContractFactory("MOKToken");
  const mokToken = await MOKToken.deploy(ethers.utils.parseEther("1000000"));
  await mokToken.deployed();

  console.log("MOKToken deployed to:", mokToken.address);

  // Transfer MOK tokens to the new account
  const tokensToTransfer = ethers.utils.parseEther("1000");
  await mokToken.transfer(newAccountAddress, tokensToTransfer);
  console.log("Transferred", tokensToTransfer.toString(), "MOK tokens to:", newAccountAddress);

  // Deploy Lottery
  const Lottery = await ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    mokToken.address,
    deployer.address,
    ethers.utils.parseEther("0.01"),
    1
  );
  await lottery.deployed();

  console.log("Lottery deployed to:", lottery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
