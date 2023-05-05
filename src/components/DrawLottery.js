import React, { useContext, useEffect, useState } from "react";
import { BlockchainContext } from "../context/BlockchainProvider";
import AdjustTicketPrice from "./AdjustTicketPrice";
import { Button, Card } from "antd";
import axios from "axios";

const DrawLottery = () => {
  const { web3, accounts, lottery } = useContext(BlockchainContext);
  const [winner, setWinner] = useState(null); // State to store winner's address
  const [prizePool, setPrizePool] = useState("0"); // State to store current prize pool

  const handleDraw = async () => {
    if (!web3 || !accounts || accounts.length === 0) {
      console.error("Web3 or accounts not available");
      return;
    }

    try {
      const prize = await lottery.methods.prizePool().call();
      console.log("Prize pool:", prize);
      setPrizePool(prize.toString());


      await lottery.methods.drawWinner().send({ from: accounts[0] });
      console.log("Lottery drawn successfully");
    } catch (error) {
      console.error("Error drawing lottery:", error);
    }
  };

  useEffect(() => {
    const setupWinnerDrawnEventListener = async () => {
      if (!web3 || !accounts || accounts.length === 0) {
        console.error("Web3 or accounts not available");
        return;
      }

      lottery.events.WinnerDrawn({}, (error, event) => {
        if (error) {
          console.error("Error listening to WinnerDrawn event:", error);
          return;
        }

        console.log("WinnerDrawn event:", event);
        const winnerAddress = event.returnValues.winner;
        console.log("Winner:", winnerAddress);
        setWinner(winnerAddress); // Update the winner's address in the state

        // Update the winner and prize pool in the database
        const data = { winner: winnerAddress, prize: prizePool };
        axios.post("http://localhost:3000/lottery/match", data)
          .then(response => console.log(response))
          .catch(error => console.error("Error updating winner and prize pool:", error));
      });
    };

    setupWinnerDrawnEventListener();
    // Clean up the listener when the component is unmounted
    return () => {
      if (web3) {
        web3.eth.clearSubscriptions();
      }
    };
  }, [web3, accounts, prizePool]);

  return (
    <Card title="Draw Lottery">
      <Button type="primary" onClick={handleDraw} ghost>
        Draw
      </Button>
      {winner && ( // Conditionally render winner's address when available
        <div>
          <h4>Winner:</h4>
          <p>{winner}</p>
        </div>
      )}
      <AdjustTicketPrice />
    </Card>
  );
};

export default DrawLottery;
