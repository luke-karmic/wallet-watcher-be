import { ethers } from "ethers";
import { getERC721Contracts } from "../src/utils/http";

// Mock the ethers provider for testing
jest.mock("ethers", () => ({
  providers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getBalance: jest.fn().mockResolvedValueOnce(ethers.BigNumber.from(1)),
    })),
  },
  Contract: jest.fn().mockImplementation(() => ({
    queryFilter: jest
      .fn()
      .mockResolvedValueOnce([
        { address: "0xContract1" },
        { address: "0xContract2" },
      ]),
  })),
}));

// describe("getERC721Contracts", () => {
//   it("should return the list of ERC721 contracts", async () => {
//     const walletAddress = "0xWalletAddress";

//     // Run the function
//     const result = await getERC721Contracts(walletAddress);

//     // Assert the result
//     expect(result).toEqual(["0xContract1", "0xContract2"]);

//     // Check if ethers provider methods were called correctly
//     expect(ethers.providers.JsonRpcProvider).toHaveBeenCalledWith(
//       process.env.INFURA_PROJECT_ID
//     );
//     expect(ethers.providers.JsonRpcProvider).toHaveBeenCalledTimes(1);
//     expect(ethers.providers.JsonRpcProvider().getBalance).toHaveBeenCalledWith(
//       walletAddress
//     );
//     expect(ethers.providers.JsonRpcProvider().getBalance).toHaveBeenCalledTimes(
//       1
//     );

//     // Check if ethers Contract method was called correctly
//     expect(ethers.Contract).toHaveBeenCalledWith(
//       walletAddress,
//       expect.any(Array),
//       ethers.providers.JsonRpcProvider()
//     );
//     expect(ethers.Contract).toHaveBeenCalledTimes(1);
//     expect(ethers.Contract().queryFilter).toHaveBeenCalledWith(
//       ethers.Contract().filters.Transfer(null, walletAddress),
//       0,
//       "latest"
//     );
//     expect(ethers.Contract().queryFilter).toHaveBeenCalledTimes(1);
//   });
// });
