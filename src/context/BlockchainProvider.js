import React, { useState, useEffect } from "react";
import { loadWeb3, getWeb3 } from "../apis/blockchain";
import { useContext } from "react";
import {
  getMOKTokenInstance,
  getLotteryInstance,
  buyTickets,
  drawWinner,
  withdrawUsageFees,
  setTicketPrice,
  getNumberOfTickets,
  getPrizePool,
  getTicketPrice,
} from "../apis/blockchain";

export const BlockchainContext = React.createContext();


const BlockchainProvider = ({ children }) => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [mokToken, setMOKToken] = useState(undefined);
  const [lottery, setLottery] = useState(undefined);
  const [ticketPrices, setTicketPrices] = useState(undefined);
  const [prizePool, setPrizePool] = useState(undefined);
  const [numTickets, setNumTickets] = useState(undefined);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const init = async () => {
      setWeb3(await getWeb3());
    };

    init();
  }, []);

  useEffect(() => {
    if (web3) {
      const loadAccounts = async () => {
        try {
          const accounts = await web3.eth.requestAccounts();
          console.log("Accounts:", accounts);
          setAccounts(accounts);
        } catch (error) {
          console.error("Error requesting accounts:", error);
        }
      };
  
      loadAccounts();
    }
  }, [web3]);

  useEffect(() => {
    if (web3 && accounts.length > 0) {
      const loadContracts = async () => {
        const mokTokenInstance = await getMOKTokenInstance(web3, "0xF69Af6a709B642e2eb3eA4d03fe23896132D96a1"
          );
        const lotteryInstance = await getLotteryInstance(web3, "0x44F992A63b34a95DDc937453385B206f34824BD9"
          );

        lotteryInstance.events.TicketPriceSet()
        .on('data', event => console.log(event))
        .on('error', error => console.error(error));

        setMOKToken(mokTokenInstance);
        setLottery(lotteryInstance);

        const initialTicketPrice = await lotteryInstance.methods.ticketPrice().call();
        setTicketPrices(initialTicketPrice);
        console.log(initialTicketPrice)

        const initialPrizePool = await getPrizePool(lotteryInstance);
        setPrizePool(initialPrizePool);
        console.log(initialPrizePool)

        const initialNumTickets = await getNumberOfTickets(lotteryInstance, accounts[0]);
        setNumTickets(initialNumTickets);
        console.log(initialNumTickets)

        setLoading(false);
      };

      loadContracts();
    }
  }, [web3, accounts]);


  const handleBuyTickets = async (numTickets) => {
    if (mokToken && lottery && accounts.length > 0) {
      await buyTickets(mokToken, lottery, numTickets, ticketPrices, accounts[0]);
    }
  };

  const handleDrawWinner = async () => {
    if (lottery && accounts.length > 0) {
      await drawWinner(lottery, accounts[0]);
    }
  };

  const handleWithdrawUsageFees = async () => {
    if (lottery && accounts.length > 0) {
      await withdrawUsageFees(lottery, accounts[0]);
    }
  };

  const handleSetTicketPrice = async (newTicketPrice) => {
    if (lottery && accounts.length > 0) {
      await setTicketPrices(lottery, newTicketPrice, accounts[0]);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        web3,
        accounts,
        mokToken,
        lottery,
        ticketPrice: ticketPrices,
        prizePool,
        numTickets,
        handleBuyTickets,
        handleDrawWinner,
        handleWithdrawUsageFees,
        handleSetTicketPrice,
        loading,
      }}
    >
      {children}
    </BlockchainContext.Provider>
    
    
  );



};

export default BlockchainProvider;

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};
