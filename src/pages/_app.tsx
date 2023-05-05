import React from "react";
import "../styles/globals.css";
import BlockchainProvider from "../context/BlockchainProvider";

function MyApp({ Component, pageProps }) {
  return (    
  <BlockchainProvider>
    <Component {...pageProps} />
  </BlockchainProvider>
);
}

export default MyApp;

