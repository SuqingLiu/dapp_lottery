import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = "GVFZZS3r-1dSw9AlYwNOXf7Ve_mJxnJ5";
const SEPOLIA_PRIVATE_KEY = "2186a00fd5db162e8ac5c18259b92f4abe52ca7c90a0091b125b8245deb4b336";
const config: HardhatUserConfig = {
  solidity: "0.8.18",
  etherscan: {
    apiKey: "YM93IT3KEATMM49S1ZDEVF6YHT6EVGP3JV"
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};

export default config;
