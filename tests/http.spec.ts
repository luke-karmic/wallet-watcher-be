import { BaseProvider } from "@ethersproject/providers";
import { ChainId, Fetcher, Pair, Token, WETH } from "@uniswap/sdk";
import { ethers } from "ethers";
import { getEthConversionRate } from "../src/utils/http";

jest.mock("@uniswap/sdk", () => {
  const originalModule = jest.requireActual("@uniswap/sdk");
  return {
    ...originalModule,
    Route: jest.fn().mockImplementation(() => {
      // Mock the `midPrice` property
      const mockMidPrice = {
        invert: jest.fn().mockReturnThis(),
        toSignificant: jest.fn().mockReturnValue("1.50000"), // Set the desired mock value for `midPrice`
      };

      return {
        midPrice: mockMidPrice,
      };
    }),
  };
});

describe("http", () => {
  describe("getEthValue", () => {
    it("should return the ETH value for a given token and amount", async () => {
      process.env.ALCHEMY_KEY = "D3PHHd9zmfUT8qTO-WN4z20wIvqN7eYL";
      // Mocked dependencies and data
      const tokenAddress = "0x123456789";

      // Mocked provider
      const getDefaultProviderMock = jest
        .spyOn(ethers.providers, "getDefaultProvider")
        .mockReturnValue({} as BaseProvider);
      const fetchTokenDataMock = jest
        .spyOn(Fetcher, "fetchTokenData")
        .mockResolvedValue({} as Token);
      const fetchPairDataMock = jest
        .spyOn(Fetcher, "fetchPairData")
        .mockResolvedValue({} as Pair);

      // Call the function
      const ethConversionRate = await getEthConversionRate(tokenAddress);

      // Assertions
      expect(getDefaultProviderMock).toHaveBeenCalledWith(ChainId.MAINNET, {
        alchemy: "D3PHHd9zmfUT8qTO-WN4z20wIvqN7eYL",
      });
      expect(fetchTokenDataMock).toHaveBeenCalledWith(
        ChainId.MAINNET,
        tokenAddress,
        expect.anything()
      );
      expect(fetchPairDataMock).toHaveBeenCalledWith(
        expect.anything(),
        WETH[ChainId.MAINNET]
      );

      expect(ethConversionRate).toEqual({
        ethConversionRate: 1.5,
        ethPrice: 1.5,
      });
    });
  });
});
