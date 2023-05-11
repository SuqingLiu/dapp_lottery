// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const Profile = ({ userAddress }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (userAddress) {
        try {
          console.log('Fetching tickets for user:', userAddress);
          const response = await axios.get(`http://localhost:3000/tickets/user/${userAddress}`);
          setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
    };
  
    fetchTickets();
  }, [userAddress]);

  const columns = [
    { title: 'Ticket ID', dataIndex: 'id', key: 'id' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div>
      <h2>Your Tickets</h2>
      <Table dataSource={tickets} columns={columns} rowKey="id" />
    </div>
  );
};

export default Profile;
