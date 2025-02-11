import { ChainId, Fetcher, Route, WETH } from "@uniswap/sdk";
import axios from "axios";
import Decimal from "decimal.js";
import { ethers } from "ethers";

export const getTokenConversionRate = async (
  currency: string
): Promise<number> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=eth`
    );
    const tokenData = response.data[currency.toLowerCase()];
    return tokenData.eth;
  } catch (error) {
    console.error("Error retrieving conversion rate:", error);
    throw error;
  }
};

export const getEthConversionRate = async (
  tokenAddress: string,
  pairCache: Map<string, any>
): Promise<{
  ethConversionRate: number;
  ethPrice: number;
}> => {
  const provider = ethers.providers.getDefaultProvider(ChainId.MAINNET, {
    alchemy: process.env.ALCHEMY_KEY,
  });
  const token = await Fetcher.fetchTokenData(
    ChainId.MAINNET,
    tokenAddress,
    provider
  );
  let pair = pairCache.get(tokenAddress);
  if (!pair) {
    pair = await Fetcher.fetchPairData(token, WETH[ChainId.MAINNET]);
    pairCache.set(tokenAddress, pair);
  }
  const weth = WETH[ChainId.MAINNET];
  const route = new Route([pair], weth); // SLOW
  const mid = route.midPrice.invert().toSignificant(6);

  return {
    ethConversionRate: new Decimal(mid).toNumber(),
    ethPrice: new Decimal(route.midPrice.toSignificant(6)).toNumber(),
  };
};

export const getETHPrice = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const ethPrice = response.data.ethereum.usd;
    return ethPrice;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error;
  }
};
