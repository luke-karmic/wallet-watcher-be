import Decimal from "decimal.js";
import { EthValueConversionCache } from "../src/types/mainTypes";
import {
  calculateEthValueWithDecimals,
  calculateSupplyPercentage,
  updateConversionRateCache,
} from "../src/utils/helpers";

jest.mock("../src/utils/http", () => {
  const originalModule = jest.requireActual("../src/utils/http");
  return {
    ...originalModule,
    getEthConversionRate: jest.fn(() =>
      Promise.resolve({
        ethConversionRate: 8.7e-6,
        ethPrice: 0.026099999999999998,
      })
    ), // 1 CAI = 8.7e-06
  };
});

describe("utils", () => {
  const mockDate = new Date("2022-01-01T00:00:00.000Z"); // 1640995200000

  describe("calculateSupplyPercentage", () => {
    it("calculates the percentage correctly", async () => {
      const mockERC20Contract = {
        contract: {
          totalSupply: jest.fn().mockResolvedValue(BigInt(1000000000000000000)), // Mock implementation of totalSupply method
        },
      };

      const result = await calculateSupplyPercentage(
        BigInt(500000000000000000),
        mockERC20Contract as any
      );
      expect(result.toNumber()).toBeCloseTo(49.95004995004995, 2);
    });
  });

  describe("updateConversionRateCache", () => {
    it("retrieves latest token conversion rate in ETH for current coin with the timestamp", async () => {
      process.env.ETH_CONVERSION_RATE_CACHE_EXPIRY = "300000"; // 5 minutes
      const mockDate = new Date("2022-01-01T00:00:00.000Z"); // 1640995200000
      jest
        .spyOn(global.Date, "now")
        .mockImplementation(() => mockDate.getTime());
      const priceDataCache: EthValueConversionCache = {};
      const updatedPriceData = await updateConversionRateCache(
        "0000000",
        priceDataCache
      );
      expect(updatedPriceData).toEqual({
        "0000000": {
          ethConversionRate: 0.0000087,
          expiryTime: 1640995500000,
          ethPrice: 0.026099999999999998,
        },
      });
    });

    it("should update with the latest value if the timestamp is older than 5 minutes", async () => {
      jest
        .spyOn(global.Date, "now")
        .mockImplementation(() => mockDate.getTime());
      const priceData: EthValueConversionCache = {
        "0000000": {
          ethConversionRate: 0.026099999999999998,
          expiryTime: 1640995164000,
          ethPrice: 0.026099999999999998,
        }, // Now - 4 minutes
      };
      const updatedPriceData = await updateConversionRateCache(
        "0000000",
        priceData
      );
      expect(updatedPriceData).toEqual({
        "0000000": {
          ethConversionRate: 0.0000087,
          expiryTime: 1640995500000,
          ethPrice: 0.026099999999999998,
        }, // Now - 4 minutes
      });
    });

    it("does not update when getEthValueFails and returns undefined", () => {});
  });

  describe("calculateEthValueWIthDecimals", () => {
    it("calculates the ETH value with decimals correctly", () => {
      const tokenAmount = new Decimal("705500000"); // 705.5 dollars
      const decimals = 6;
      const conversionRate = new Decimal(0.0006); // exchange rate for ETH

      const ethValue = calculateEthValueWithDecimals(
        tokenAmount,
        decimals,
        conversionRate
      );

      expect(Number(ethValue)).toBe(0.4233);
    });
  });
});
