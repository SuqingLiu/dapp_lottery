import React, { useContext, useState, useEffect } from "react";
import { BlockchainContext } from "../context/BlockchainProvider";
import {
  getNumberOfTickets,
  getPrizePool,
  getTicketPrice,
} from "../apis/blockchain";
import { Card, Spin } from "antd";
import axios from "axios";

const LotteryInfo = () => {
  const { web3, accounts, lottery } = useContext(BlockchainContext);
  const [ticketPrice, setTicketPrice] = useState(undefined);
  const [prizePool, setPrizePool] = useState(undefined);
  const [numTickets, setNumTickets] = useState(undefined);
  const [latestPrize, setLatestPrize] = useState(undefined);
  const [latestWinner, setLatestWinner] = useState(undefined);

  useEffect(() => {
    const fetchTicketPrice = async () => {
      if (lottery) {
        const price = await getTicketPrice(lottery);
        setTicketPrice(price);
      }
    };
    fetchTicketPrice();
  }, [lottery]);

  useEffect(() => {
    const fetchPrizePool = async () => {
      if (lottery) {
        const pool = await getPrizePool(lottery);
        setPrizePool(pool);
      }
    };
    fetchPrizePool();
  }, [lottery]);

  useEffect(() => {
    const fetchNumTickets = async () => {
      if (lottery && accounts.length > 0) {
        const num = await getNumberOfTickets(lottery, accounts[0]);
        setNumTickets(num);
      }
    };
    fetchNumTickets();
  }, [lottery, accounts]);

  useEffect(() => {
    const fetchLatestPrize = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/lottery/prize");
        setLatestPrize(data);
        console.log("Latest prize:", data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatestPrize();
  }, []);

  useEffect(() => {
    const fetchLatestWinner = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/lottery/winner");
        setLatestWinner(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatestWinner();
  }, []);

  return (
    <Card title="Lottery Information">
      <Spin spinning={!ticketPrice || !prizePool || !numTickets || !latestPrize || !latestWinner}>
        <p>Ticket Price: {ticketPrice ? `${ticketPrice} MOK` : "Loading..."}</p>
        <p>Prize Pool: {prizePool ? `${prizePool} MOK` : "Loading..."}</p>
        <p>My Number of Tickets: {numTickets || "Loading..."}</p>
        <p>Latest Prize: {latestPrize || "Loading..."}</p>
        <p>Latest Winner: {latestWinner || "Loading..."}</p>
      </Spin>
    </Card>
  );
};

export default LotteryInfo;
