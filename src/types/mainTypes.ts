import Decimal from "decimal.js";
import { BaseContract, BigNumber } from "ethers";

export type DEXTradedContract = {
  tokenAddress: string;
  contract: ERC20Contract;
  totalSupply: bigint;
  decimals: number;
  name?: string;
  symbol?: string;
  iconUrl?: string;
  txUrl?: string;
  thresholds: ContractThreshold;
};

export type TransferEvent = {
  from?: string;
  to?: string;
  amount: BigNumber;
};

export type ContractThreshold = {
  transferSupplyThreshold: Decimal;
  ethAlertThreshold: Decimal;
  priceImpactThreshold?: Decimal;
};

export type ContractEventInfo = {
  ethValue: Decimal;
  dollarValue?: Decimal;
  priceImpact?: string;
};

export type MappedTransferEvent = DEXTradedContract &
  TransferEvent &
  ContractEventInfo;

export type SmartContracts = {
  [key: string]: {
    name: string;
    address: string;
  };
};

export interface ERC20Contract extends BaseContract {
  totalSupply(): Promise<bigint>;
  decimals(): BigNumber;
  name(): string;
  symbol(): string;
}

export type EthValueConversionCache = {
  [key: string]: {
    ethConversionRate: number;
    expiryTime: number;
    ethPrice: number;
  };
};

export type TransferInfo = {
  transferSupplyPercentage: Decimal;
  ethValue: Decimal;
  dollarValue: Decimal;
};

export type TokenBalances = {
  [key: string]: {
    tokenAddress: string;
    balance?: number;
  };
};

export interface CoinBalance {
  coin: string;
  transferBalance: number;
}

export interface ContractTriggerThreshold {
  [tokenSymbol: string]: {
    transferSupplyThreshold: Decimal;
    ethAlertThreshold: Decimal;
  };
}

/**
 * Telegram Alerts
 */

/**
 * NFT Alerts
 */

export type NFTContract = {
  name: string;
  symbol: string;
  address: string;
  chain: string;
};

export type NFTData = {
  name: string;
  volume: number;
  floorPrice: number;
};

export type NFTTradedContract = NFTContract & NFTAlertData;

export interface OpenSeaStats {
  one_minute_volume: number;
  one_minute_change: number;
  one_minute_sales: number;
  one_minute_sales_change: number;
  one_minute_average_price: number;
  one_minute_difference: number;
  five_minute_volume: number;
  five_minute_change: number;
  five_minute_sales: number;
  five_minute_sales_change: number;
  five_minute_average_price: number;
  five_minute_difference: number;
  fifteen_minute_volume: number;
  fifteen_minute_change: number;
  fifteen_minute_sales: number;
  fifteen_minute_sales_change: number;
  fifteen_minute_average_price: number;
  fifteen_minute_difference: number;
  thirty_minute_volume: number;
  thirty_minute_change: number;
  thirty_minute_sales: number;
  thirty_minute_sales_change: number;
  thirty_minute_average_price: number;
  thirty_minute_difference: number;
  one_hour_volume: number;
  one_hour_change: number;
  one_hour_sales: number;
  one_hour_sales_change: number;
  one_hour_average_price: number;
  one_hour_difference: number;
  six_hour_volume: number;
  six_hour_change: number;
  six_hour_sales: number;
  six_hour_sales_change: number;
  six_hour_average_price: number;
  six_hour_difference: number;
  one_day_volume: number;
  one_day_change: number;
  one_day_sales: number;
  one_day_sales_change: number;
  one_day_average_price: number;
  one_day_difference: number;
  seven_day_volume: number;
  seven_day_change: number;
  seven_day_sales: number;
  seven_day_average_price: number;
  seven_day_difference: number;
  thirty_day_volume: number;
  thirty_day_change: number;
  thirty_day_sales: number;
  thirty_day_average_price: number;
  thirty_day_difference: number;
  total_volume: number;
  total_sales: number;
  total_supply: number;
  count: number;
  num_owners: number;
  average_price: number;
  num_reports: number;
  market_cap: number;
  floor_price: null | number;
}

type IntervalData = {
  floorPriceEth: number;
  floorPriceDollar: number;
  volume: number;
  sales: number;
  salesChange?: number;
};

export interface NFTProjectData {
  projectName: string;
  address: string;
  intervalData: Record<string, IntervalData>;
}

/**
 * Notifications
 */
export interface NFTAlertData {
  nftProject: string;
  floorPriceEth: number;
  floorPriceDollar: number;
  floorPriceDepth: number;
  nftProjectUrl: string;
  oneDayListings: number;
}

export type PeriodicUpdateData = {
  walletAddress: string;
  tradedProjects: DEXTradedContract[];
  nftProjects: NFTTradedContract[];
};

export enum TelegramDeliveryMode {
  Text,
  Image,
}

export interface WhaleAlertData {
  iconUrl: string;
  token: string;
  txValueETH: string;
  txValueUSD: string;
  percentTotalSupply: string;
  direction?: string;
  priceImpact: string;
  priceImpactColour: PriceImpactColour;
  transactionLink: string;
}

export enum PriceImpactColour {
  Green = "#37ff26",
  Yellow = "#ffed00",
  Red = "ff0c0c",
}

export interface DeliveryMetaData<T extends Record<string, any>> {
  mode: TelegramDeliveryMode;
  captionInfo?: T & { url: string };
  height: number;
  generateHTML: () => Promise<string>;
}

export enum NotificationType {
  NFT,
  DEX,
}

export type Notification = {
  title: string;
  assetName: string;
  assetImageUrl: string;
  header: NotificationAlertMainHeader;
  type: NotificationType;
  rowData: NotificationInformationRow[];
};

export type NotificationAlertMainHeader = {
  message: string;
  subMessage: string;
};

/**
 * Notification custom designs
 */
export type NotificationInformationRow = {
  [key: string]: {
    label: string;
    value: string;
    subValue: string;
    order?: number;
  };
};

export type NotificationFullData = NotificationDesign &
  NotificationInformationRow;

export enum NotificationEmbelishmentType {
  NFTImage,
  PriceImpactColour,
}

export type NotificationEmbellishment = {
  type: NotificationEmbelishmentType;
  metadata: Record<string, any>;
};

export type NotificationDesign = {
  name: string;
  outerHtml: string;
  rowBlockHtml: string;
  css: string;
  embelishments?: NotificationEmbellishment[]; // For example, NFT image background
};
