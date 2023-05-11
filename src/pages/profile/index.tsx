import React from 'react';
import Profile from '../../components/Profile';
import Layout from '../../components/Layout';
import { useBlockchain } from '../../context/BlockchainProvider';

const Purchase = () => {
  const { accounts } = useBlockchain();
  const userAddress = accounts && accounts.length > 0 ? accounts[0] : '';

  return (
    <div>
      <Layout>
        <h1>{userAddress}'s Profile</h1>
        <Profile userAddress={userAddress} />
      </Layout>
    </div>
  );
};

export default Purchase;
