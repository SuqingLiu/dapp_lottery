import React, { useContext, useState } from 'react';
import { BlockchainContext } from '../context/BlockchainProvider';
import { Button, Input, Typography } from 'antd';
import axios from 'axios';
import { useBlockchain } from '../context/BlockchainProvider';


const { Title } = Typography;


const TicketPurchase = () => {
  const { numTickets, handleBuyTickets } = useContext(BlockchainContext);
  const [numTicketsInput, setNumTicketsInput] = useState('');
  const { accounts } = useBlockchain();
  const userAddress = accounts && accounts.length > 0 ? accounts[0] : '';

  const createTicket = async (ticketData) => {
    try {
      const response = await axios.post('http://localhost:3000/tickets', ticketData);
      console.log('Ticket created successfully:', response.data);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleInputChange = (e) => {
    setNumTicketsInput(e.target.value);
  };

  const handleBuyButtonClick = () => {
    const parsedNumTickets = parseInt(numTicketsInput, 10);

    if (isNaN(parsedNumTickets) || parsedNumTickets < 1) {
      console.error('Invalid number of tickets');
      return;
    }

    setNumTicketsInput('');
    handleBuyTickets(parsedNumTickets);
    console.log('Tickets purchased successfully');

    // Create a new ticket
    const ticketData = { amount: parsedNumTickets, userAddress: userAddress, date: new Date() };
    console.log('Ticket data:', ticketData);
    createTicket(ticketData);
  };

  return (
    <div>
      <Title level={3}>Buy Tickets</Title>
      <Input
        type="number"
        value={numTicketsInput}
        onChange={handleInputChange}
        style={{ width: '100px', marginRight: '20px' }}
      />
      <Button type="primary" onClick={handleBuyButtonClick} ghost>
        Buy
      </Button>
    </div>
  );
};

export default TicketPurchase;
