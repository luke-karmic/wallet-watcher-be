import Decimal from "decimal.js";
import {
  DEXTradedContract,
  EthValueConversionCache as EthValueConversionCache,
  NFTContract,
  NFTProjectData,
} from "../types/mainTypes";
import { getETHPrice, getEthConversionRate } from "./http";
import {
  ChainId,
  Fetcher,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from "@uniswap/sdk";
import { Chain, OpenSeaAPI } from "opensea-js";

export const calculateSupplyPercentage = (
  transferValue: bigint,
  dexContract: DEXTradedContract
): Decimal => {
  const percentage =
    Number((transferValue * 10000n) / BigInt(dexContract.totalSupply)) / 100.1;

  const decimalPercentage = new Decimal(percentage);

  return decimalPercentage;
};

/**
 * Get recent pricing data for token
 * @param amount
 * @param priceData
 * @returns
 */
export const updateConversionRateCache = async (
  tokenAddress: string,
  priceDataCache: EthValueConversionCache,
  pairCache: Map<string, any>
): Promise<EthValueConversionCache> => {
  let retryCount = 0;
  let maxRetries = 3;
  let ethConversions;

  while (retryCount < maxRetries) {
    try {
      ethConversions = await getEthConversionRate(tokenAddress, pairCache);
      break; // Break out of the loop if the call is successful
    } catch (error) {
      console.error(
        `Error retrieving ETH conversion rate. Retrying... (${
          retryCount + 1
        }/${maxRetries})`
      );
      retryCount++;
    }
  }

  if (ethConversions) {
    priceDataCache[tokenAddress] = {
      ethConversionRate: ethConversions.ethConversionRate,
      ethPrice: ethConversions.ethPrice,
      expiryTime:
        Date.now() + parseInt(process.env.ETH_CONVERSION_RATE_CACHE_EXPIRY), // 5 minutes
    };
  }

  return priceDataCache;
};

export const convertToCamelCase = (name: string): string => {
  const words = name.split(" ");
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });
  return camelCaseWords.join("");
};

export const calculateEthValueWithDecimals = (
  tokenAmount: Decimal,
  decimals: number,
  conversionRate: Decimal
): Decimal => {
  const power = new Decimal(10).pow(decimals);
  const ethValue = conversionRate.times(tokenAmount).div(power);

  return ethValue;
};

export const calculateDollarValue = (
  ethAmount: Decimal,
  conversionRate: Decimal,
  decimals: number,
  ethPrice: Decimal
): Decimal => {
  const power = new Decimal(10).pow(decimals);
  const ethValue = conversionRate.times(ethAmount).div(power);

  return ethValue.times(ethPrice);
};

export const calculatePriceImpact = async (
  tokenAddress: string,
  amount: string
): Promise<string> => {
  try {
    const token0 = new Token(ChainId.MAINNET, tokenAddress, 18);
    const weth = WETH[ChainId.MAINNET];
    const pair = await Fetcher.fetchPairData(token0, weth);

    const route = new Route([pair], token0);
    const trade = new Trade(
      route,
      new TokenAmount(token0, amount),
      TradeType.EXACT_INPUT
    );

    const priceImpact = trade.priceImpact;

    const percentage = priceImpact.toFixed(3);

    return percentage;
  } catch (err) {
    // console.log(err);
  }
};

export const getERC721Contracts = async (
  walletAddress: string | undefined
): Promise<NFTContract[]> => {
  const { default: Moralis } = await import("moralis");
  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
    chain: "0x1",
    address: walletAddress,
  });

  let contractData: NFTContract[] = [];

  response.result.forEach((contract) => {
    contractData.push({
      name: contract.name,
      symbol: contract.symbol,
      address: contract.tokenAddress.lowercase,
      chain: contract.chain.name,
    });
  });

  return contractData;
};

export async function getNFTData(
  tokenAddress: string
): Promise<NFTProjectData> {
  const openseaAPI = new OpenSeaAPI({
    apiKey: process.env.OPENSEA_KEY,
    chain: Chain.Mainnet,
  });

  const ethPrice = await getETHPrice();

  const openseaAsset = await openseaAPI.getAsset(
    {
      tokenAddress,
      tokenId: null,
    },
    3
  );

  const openseaCollection = await openseaAPI.getCollection(
    openseaAsset.collection.slug
  );

  const nftProjectData: NFTProjectData = {
    projectName: openseaAsset.collection.name,
    address: tokenAddress,
    intervalData: {
      "1d": {
        floorPriceEth: openseaCollection.stats.one_day_average_price,
        floorPriceDollar:
          openseaCollection.stats.one_day_average_price * ethPrice,
        volume: openseaCollection.stats.one_day_volume,
        sales: openseaCollection.stats.one_day_sales,
        salesChange: openseaCollection.stats.one_day_sales_change,
      },
      "7d": {
        floorPriceEth: openseaCollection.stats.seven_day_average_price,
        floorPriceDollar:
          openseaCollection.stats.seven_day_average_price * ethPrice,
        volume: openseaCollection.stats.seven_day_volume,
        sales: openseaCollection.stats.seven_day_sales,
      },
      "30d": {
        floorPriceEth: openseaCollection.stats.thirty_day_average_price,
        floorPriceDollar:
          openseaCollection.stats.thirty_day_average_price * ethPrice,
        volume: openseaCollection.stats.thirty_day_volume,
        sales: openseaCollection.stats.thirty_day_sales,
      },
    },
  };

  return nftProjectData;
}

// async function getUniswapV3Token(tokenAddress: string) {
//   const chainId = ChainId.MAINNET;
//   try {
//     const token = new Token(chainId, tokenAddress, 18); // Assuming the token has 18 decimals

//     await Fetcher.fetchTokenData(chainId, tokenAddress);
//     const logoUrl = token.logoURI;
//     const symbol = token.symbol;
//     const name = token.name;

//     return { logoUrl, symbol, name };
//   } catch (error) {
//     console.error('Error fetching Uniswap V3 token:', error);
//     return null;
//   }
// }

//   .then((token) => {
//     if (token) {
//       // Perform further processing or access the token properties as needed
//       console.log('Token:', token);
//       console.log('Token Logo URI:', token.logoURI);
//       console.log('Token Symbol:', token.symbol);
//       console.log('Token Name:', token.name);
//     } else {
//       console.log('Unable to fetch Uniswap V3 token.');
//     }
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
