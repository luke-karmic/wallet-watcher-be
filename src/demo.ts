import Decimal from "decimal.js";
import { sendAlert } from "./notifications/telegram";
import {
  Notification,
  NotificationDesign,
  NotificationType,
} from "./types/mainTypes";
import {
  DEXTradedContract,
  ERC20Contract,
  NFTTradedContract,
  TelegramDeliveryMode,
} from "./types/mainTypes";
import { NotificationBuilder } from "./notifications/notification-builder";
import connectToDatabase from "./utils/db";
import mongoose from "mongoose";
import { NotificationDesignRepository } from "wallet-watcher-models";

const sendRandomNFTAlert = async (design: NotificationDesign) => {
  const notificationExample: Notification = {
    title: "NFT Projects (Big Changes)",
    assetName: "CRYPTOPUNKS",
    assetImageUrl:
      "https://lh3.googleusercontent.com/MjB7F6hrzm09mRsiqZ0A63XeDIuTUKTLzer9Ekoe7OTFiAKA7DZKD8fz9pBt8Pfq1Cecvs4Kxm_oEpujI_LXi9604BeWW2sMHpw=s1000",
    type: NotificationType.NFT,
    header: {
      message: "44.07 ETH",
      subMessage: "(+17.03% 1m)",
    },
    rowData: [
      {
        floorPrice1h: {
          label: "Floor Price - 1H",
          value: "(+2.01%)",
          subValue: "$2,342",
        },
      },
      {
        floorPrice24h: {
          label: "Floor Price - 24H",
          value: "(+3.22%)",
          subValue: "$5,433)",
        },
      },
      {
        floorPrice30d: {
          label: "Floor Price - 30d",
          value: "(+27.22%)",
          subValue: "$14,2322",
        },
      },
      {
        listingsPastDay: {
          label: "Listings in past day",
          value: "4 (+2)",
          subValue: "50.3%",
        },
      },
    ],
  };

  await sendAlert({
    mode: TelegramDeliveryMode.Image,
    generateHTML: async () =>
      NotificationBuilder.build(design, notificationExample),
    height: 650,
    captionInfo: {
      url: "",
      symbol: "CRYPTOPUNKS",
      priceImpact: "32.04%",
      ethValue: "17.11",
    },
  });
};

const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizeWhaleData = (): Notification => {
  const tokenSymbols = ["BTC", "DOGE", "XRP", "SHIB", "AVAX", "VET"]; // Replace with your desired token symbols
  const iconUrls = [
    "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025",
    "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=025",
    "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=025",
    "https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=025",
    "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=025",
    "https://cryptologos.cc/logos/vechain-vet-logo.png?v=025",
  ];

  const randomTokenSymbol =
    tokenSymbols[getRandomInt(0, tokenSymbols.length - 1)];
  const randomETHValue = getRandomFloat(0.1, 100).toFixed(3) + " ETH";
  const randomUSDValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getRandomFloat(100, 1000000));
  const randomTransferSupplyPercentage =
    getRandomFloat(0.001, 10).toFixed(3) + "%";
  const randomPriceImpact = getRandomFloat(0.001, 100).toFixed(3) + "%";
  const randomIconUrl = iconUrls[getRandomInt(0, iconUrls.length - 1)];

  const notification: Notification = {
    title: "Whale Transaction Alert",
    assetName: randomTokenSymbol,
    assetImageUrl: randomIconUrl,
    header: {
      message: randomPriceImpact,
      subMessage: randomTransferSupplyPercentage,
    },
    type: NotificationType.DEX,
    rowData: [
      {
        txValueEth: {
          label: "(ETH) Transaction Value Total",
          value: randomETHValue,
          subValue: "0.26%",
        },
      },
      {
        txValueUSD: {
          label: "($) Transaction Value Total",
          value: randomUSDValue,
          subValue: "0.26%",
        },
      },
    ],
  };

  return notification;
};

// Function to generate a random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Function to send whale alerts in order of array index with a random interval
const sendSequentialWhaleAlerts = async (
  index: number,
  design: NotificationDesign
) => {
  const notifications: Notification[] = [
    {
      title: "Whale Transaction Alert",
      assetName: "VET",
      assetImageUrl: "https://cryptologos.cc/logos/vechain-vet-logo.png?v=025",
      header: {
        message: "2.11%",
        subMessage: "0.04%",
      },
      type: NotificationType.DEX,
      rowData: [
        {
          txValueEth: {
            label: "(ETH) Transaction Value Total",
            value: "17.1702 ETH",
            subValue: "0.26%",
          },
        },
        {
          txValueUSD: {
            label: "($) Transaction Value Total",
            value: "$35,323.32",
            subValue: "0.26%",
          },
        },
      ],
    },
    {
      title: "Whale Transaction Alert",
      assetName: "VET",
      assetImageUrl: "https://cryptologos.cc/logos/vechain-vet-logo.png?v=025",
      header: {
        message: "6.04%",
        subMessage: "0.04%",
      },
      type: NotificationType.DEX,
      rowData: [
        {
          txValueEth: {
            label: "(ETH) Transaction Value Total",
            value: "17.5702 ETH",
            subValue: "0.26%",
          },
        },
        {
          txValueUSD: {
            label: "($) Transaction Value Total",
            value: "$35,323.32",
            subValue: "0.26%",
          },
        },
      ],
    },
    {
      title: "Whale Transaction Alert",
      assetName: "DOGE",
      assetImageUrl:
        "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=025",
      header: {
        message: "6.04%",
        subMessage: "0.04%",
      },
      type: NotificationType.DEX,
      rowData: [
        {
          txValueEth: {
            label: "(ETH) Transaction Value Total",
            value: "3.5702 ETH",
            subValue: "0.26%",
          },
        },
        {
          txValueUSD: {
            label: "($) Transaction Value Total",
            value: "$12,323.32",
            subValue: "0.26%",
          },
        },
      ],
    },
  ];

  if (index < notifications.length) {
    const notification: Notification = notifications[index];
    await sendAlert({
      mode: TelegramDeliveryMode.Image,
      generateHTML: async () => NotificationBuilder.build(design, notification),
      height: 400,
      captionInfo: {
        symbol: notification.assetName,
        url: notification.assetImageUrl,
        priceImpact: notification.header.message,
        ethValue: notification.header.subMessage,
      },
    });

    // Call the function again after a random delay between 5 to 15 seconds
    setTimeout(
      () => sendSequentialWhaleAlerts(index + 1, design),
      getRandomNumber(5000, 15000)
    );
  }
};

const sendRandomWhaleAlert = async (design: NotificationDesign) => {
  const whaleData: Notification = randomizeWhaleData();

  await sendAlert({
    mode: TelegramDeliveryMode.Image,
    generateHTML: async () => NotificationBuilder.build(design, whaleData),
    height: 400,
    captionInfo: {
      symbol: whaleData.assetName,
      url: whaleData.assetImageUrl,
      priceImpact: whaleData.header.message,
      ethValue: whaleData.header.subMessage,
    },
  });

  setTimeout(sendRandomWhaleAlert, getRandomNumber(5000, 10000));
};

(async () => {
  await connectToDatabase();
  // Execute a test query or operation
  const notificationDesignRepository = new NotificationDesignRepository(
    mongoose
  );
  const design = await notificationDesignRepository.findByName(
    "design-uniswap-v2"
  );
  const nftContracts: NFTTradedContract[] = [
    {
      name: "CryptoPunks",
      symbol: "PUNKS",
      address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      chain: "0x1",
      nftProject: "CryptoPunks",
      floorPriceEth: 56.5,
      floorPriceDollar: 213000,
      floorPriceDepth: 0,
      nftProjectUrl: "https://www.larvalabs.com/cryptopunks",
      oneDayListings: 3,
    },
    {
      name: "CryptoKitties",
      symbol: "CK",
      address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
      chain: "0x1",
      nftProject: "CryptoKitties",
      floorPriceEth: 1.3,
      floorPriceDollar: 1576,
      floorPriceDepth: 13,
      nftProjectUrl: "https://www.larvalabs.com/cryptopunks",
      oneDayListings: 3,
    },
  ];
  const dexContracts: DEXTradedContract[] = [
    {
      tokenAddress: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      contract: {} as ERC20Contract,
      totalSupply: BigInt(0),
      decimals: 18,
      name: "WBNB",
      symbol: "WBNB",
      iconUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
      txUrl:
        "https://bscscan.com/token/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      thresholds: {
        transferSupplyThreshold: new Decimal(0.1),
        ethAlertThreshold: new Decimal(13.1),
        priceImpactThreshold: new Decimal(5.0),
      },
    },
  ];
  // await sendOpeningMessage(
  //   "", // Hard code for now
  //   nftContracts,
  //   dexContracts
  // );
  await sendRandomNFTAlert(design);
  await sendSequentialWhaleAlerts(0, design);
})();
