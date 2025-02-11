import { transferHandler } from "../src/events/transfer-handler";
import { calculateSupplyPercentage } from "../src/utils/helpers"; // Replace 'your-utils' with the correct import path for your utility functions
import { sendAlert } from "../src/notifications/telegram";
import {
  DEXTradedContract,
  ERC20Contract,
  TelegramDeliveryMode,
} from "../src/types/mainTypes";
import { Decimal } from "decimal.js";

// Mock the dependencies
jest.mock("./your-utils", () => ({
  calculateSupplyPercentage: jest.fn(),
  sendAlert: jest.fn(),
}));

describe("transferHandler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send an alert when ethValue is accurate", async () => {
    // Arrange
    const transferEvent = {
      amount: BigInt(100),
      ethValue: new Decimal(100),
      dollarValue: new Decimal(5000),
      priceImpact: new Decimal(2),
      thresholds: {
        ethAlertThreshold: new Decimal(50),
        priceImpactThreshold: new Decimal(1),
      },
      symbol: "ETH",
      iconUrl: "https://example.com/icon.png",
      tokenAddress: "0x123abc",
      contract: {} as ERC20Contract,
    };

    // Mock the calculateSupplyPercentage function to return a fixed value for testing
    calculateSupplyPercentage.mockResolvedValue(new Decimal(2));

    // Act
    await transferHandler(transferEvent);

    // Assert
    expect(calculateSupplyPercentage).toHaveBeenCalledWith(
      BigInt(100),
      transferEvent
    );
    expect(sendAlert).toHaveBeenCalledWith(
      expect.any(String),
      TelegramDeliveryMode.Text
    );
  });

  it("should not send an alert when ethValue is not accurate", async () => {
    // Arrange
    const transferEvent = {
      amount: BigInt(100),
      ethValue: new Decimal(10),
      dollarValue: new Decimal(500),
      priceImpact: new Decimal(0.5),
      thresholds: {
        ethAlertThreshold: new Decimal(50),
        priceImpactThreshold: new Decimal(1),
      },
      symbol: "ETH",
      iconUrl: "https://example.com/icon.png",
      tokenAddress: "0x123abc",
    };

    // Mock the calculateSupplyPercentage function to return a fixed value for testing
    calculateSupplyPercentage.mockResolvedValue(new Decimal(0.5));

    // Act
    await transferHandler(transferEvent);

    // Assert
    expect(calculateSupplyPercentage).toHaveBeenCalledWith(
      BigInt(100),
      transferEvent
    );
    expect(sendAlert).not.toHaveBeenCalled();
  });
});
