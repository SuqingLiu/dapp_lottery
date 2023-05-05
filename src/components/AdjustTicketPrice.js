import React, { useContext, useState } from "react";
import { BlockchainContext } from "../context/BlockchainProvider";
import { Button, Input, Typography } from "antd";

const { Title } = Typography;

const AdjustTicketPrice = () => {
  const { web3, accounts, lottery } = useContext(BlockchainContext);
  const [newTicketPrice, setNewTicketPrice] = useState(0);

  const handleAdjustPrice = async () => {
    if (!web3 || !accounts || accounts.length === 0) {
      console.error("Web3 or accounts not available");
      return;
    }

    try {
      const weiNewTicketPrice = web3.utils.toWei(
        newTicketPrice.toString(),
        "ether"
      );
      await lottery.methods
        .setTicketPrice(weiNewTicketPrice)
        .send({ from: accounts[0] });

      console.log("Ticket price adjusted successfully");
    } catch (error) {
      console.error("Error adjusting ticket price:", error);
    }
  };

  return (
    <div>
      <Title level={5} style={{marginTop: "10px"}}>Adjust Ticket Price</Title>
      <Input
        type="number"
        value={newTicketPrice}
        onChange={(e) => setNewTicketPrice(e.target.value)}
        style={{ width: "100px", marginRight: "20px" }}
      />
      <Button type="primary" onClick={handleAdjustPrice} ghost>
        Adjust Price
      </Button>
    </div>
  );
};

export default AdjustTicketPrice;
