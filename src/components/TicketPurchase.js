import React, { useContext, useState } from "react";
import { BlockchainContext } from "../context/BlockchainProvider";
import { Button, Input, Typography } from "antd";

const { Title } = Typography;

const TicketPurchase = () => {
  const { numTickets, handleBuyTickets } = useContext(BlockchainContext);
  const [numTicketsInput, setNumTicketsInput] = useState("");

  const handleTicketPurchase = async () => {
    if (!numTickets) {
      console.error("Invalid number of tickets");
      return;
    }

    try {
      await handleBuyTickets(numTickets);
      console.log("Tickets purchased successfully");
    } catch (error) {
      console.error("Error purchasing tickets:", error);
    }
  };

  const handleInputChange = (e) => {
    setNumTicketsInput(e.target.value);
  };

  const handleBuyButtonClick = () => {
    const parsedNumTickets = parseInt(numTicketsInput, 10);

    if (isNaN(parsedNumTickets) || parsedNumTickets < 1) {
      console.error("Invalid number of tickets");
      return;
    }

    setNumTicketsInput("");
    handleBuyTickets(parsedNumTickets);
    console.log("Tickets purchased successfully");
  };

  return (
    <div>
      <Title level={3}>Buy Tickets</Title>
      <Input
        type="number"
        value={numTicketsInput}
        onChange={handleInputChange}
        style={{ width: "100px", marginRight: "20px" }}
      />
      <Button type="primary" onClick={handleBuyButtonClick} ghost>
        Buy
      </Button>
    </div>
  );
};

export default TicketPurchase;
