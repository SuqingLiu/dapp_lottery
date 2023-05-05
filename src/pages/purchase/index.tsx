import React from 'react';
import TicketPurchase from '../../components/TicketPurchase';
import Layout from '../../components/Layout';

const Purchase = () => {
  return (
    <div>
        <Layout>

      <h1>Buy Tickets</h1>
      <TicketPurchase />
      </Layout>
    </div>
  );
};

export default Purchase;
