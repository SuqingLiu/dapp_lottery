import Web3 from "web3";
import MOKToken from "../abis/MOKToken.json";
import Lottery from "../abis/Lottery.json";

const ALCHEMY_API_KEY = "GVFZZS3r-1dSw9AlYwNOXf7Ve_mJxnJ5";
const SEPOLIA_RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    const web3Provider = new Web3.providers.HttpProvider(SEPOLIA_RPC_URL);
    window.web3 = new Web3(web3Provider);
  }
};

export const getWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      console.error("User denied account access");
      throw error;
    }
  } else {
    console.error("No web3 provider found");
    throw new Error("No web3 provider found");
  }
};

// Add other necessary functions for contract interaction

export const getTicketPrice = async (lottery) => {
  const ticketPrice = await lottery.methods.ticketPrice().call();
  return ticketPrice;
};

export const getNumberOfTickets = async (lottery, account) => {
  const numTickets = await lottery.methods.tickets(account).call();
  return numTickets;
};


export const getPrizePool = async (lottery) => {
  const prizePool = await lottery.methods.prizePool().call();
  return prizePool;
};

export const getMOKTokenInstance = async (web3, MOKTokenAddress) => {
  const mokToken = new web3.eth.Contract(MOKToken.abi, MOKTokenAddress);
  return mokToken;
};

export const getLotteryInstance = async (web3, LotteryAddress) => {
  const lottery = new web3.eth.Contract(Lottery.abi, LotteryAddress);
  return lottery;
};

export const buyTickets = async (mokToken, lottery, numTickets, ticketPrice, account) => {
  const amount = ticketPrice * numTickets;
  await mokToken.methods
    .approve(lottery.options.address, amount)
    .send({ from: account });

  await lottery.methods
    .buyTickets(numTickets)
    .send({ from: account });
};

export const drawWinner = async (lottery, account) => {
  await lottery.methods
    .drawWinner()
    .send({ from: account });
};

export const setTicketPrice = async (lottery, newTicketPrice, account) => {
  await lottery.methods
    .setTicketPrice(newTicketPrice)
    .send({ from: account });
};
