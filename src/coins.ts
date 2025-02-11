import { SmartContracts } from "./types/mainTypes";

(async () => {
  // Get a list of smart contracts to listen to
  const smartContracts: SmartContracts = {
    CryptoAI: {
      name: "CryptoAI",
      address: "0x0d3eaf9222f0cf1d4b218cc0a5a9a4e84c5b29a0",
    },
  };

  const listenContracts = async () => {
    // Listen to the transfer events

    const shouldSell = false;
    // On transfer event
    // Check do we need to sell this token?
    if (shouldSell) {
      await sellToken(smartContracts["CryptoAI"].address, "0");
    } else {
      const brokeSwingHigh = false; // Change with algorithm to find break

      if (brokeSwingHigh) {
        await buyToken(smartContracts["CryptoAI"].address, "0");
        // Check do we need to buy this token?
      }
    }
  };

  // Buy TOKEN
  const buyToken = async (tokenAddress: string, tokenAmount: string) => {
    // Calculate the current price of the token
    // Calculate the most recent swing high
    // did the price break the swing high?
    // if yes, BUY
  };

  const sellToken = async (tokenAddress: string, tokenAmount: string) => {
    // Perform approval on SC for MAX spending limit
    // Create TX for selling the token
  };
})();
