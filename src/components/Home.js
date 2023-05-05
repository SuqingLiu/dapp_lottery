import React, { useContext, useEffect, useState } from "react";
import { BlockchainContext } from "../context/BlockchainProvider";
import LotteryInfo from "./LotteryInfo";
import DrawLottery from "./DrawLottery";
import AdjustTicketPrice from "./AdjustTicketPrice";


const Home = () => {
  const { web3, accounts, lottery, loading } = useContext(BlockchainContext);
  const [isManagerOrOwner, setIsManagerOrOwner] = useState(false);


  useEffect(() => {
    if (!web3 || !accounts || accounts.length === 0 || !lottery) {
      console.log("Web3, accounts or lotteryContract not available");
      console.log("Web3:", web3);
      console.log("Accounts:", accounts);
      console.log("Lottery contract:", lottery);
      return;
    }
    const MANAGER_ROLE = web3.utils.keccak256("MANAGER_ROLE");
    const OWNER_ROLE = web3.utils.keccak256("OWNER_ROLE");
    const checkManagerOrOwner = async () => {

      try {
        const account = accounts[0];
        const isManager = await lottery.methods.hasRole(MANAGER_ROLE, account).call();
        const isOwner = await lottery.methods.hasRole(OWNER_ROLE, account).call();

        setIsManagerOrOwner(isManager || isOwner);
      } catch (error) {
        console.error("Error checking manager or owner:", error);
      }
    };

    if (!loading) {
      
      checkManagerOrOwner();
      console.log("Loading:", loading);
      console.log("Lottery contract:", lottery);
    }
  }, [web3, accounts, lottery, loading]);

  if (!lottery) {
    return <div>Loading lottery contract...</div>;
  }

  return (
    <div>
      <LotteryInfo />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {isManagerOrOwner && (
            <>
              <DrawLottery />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
