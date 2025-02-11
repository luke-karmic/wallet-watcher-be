import { ethers } from "ethers";
import { convertToCamelCase } from "../utils/helpers";
import { TokenBalances } from "../types/mainTypes";

const getTokenBalance = async (
  contract: ethers.Contract,
  userAddress: string
): Promise<string> => {
  const balance: ethers.BigNumberish = await contract.balanceOf(userAddress);
  return balance.toString();
};

export async function getTradedTokens(
  tokenAddresses: string[]
): Promise<TokenBalances> {
  const userAddress = ""; // hard coded for now 
  const balances: TokenBalances = {};

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_CONNECTION_STRING_HTTPS
  );

  // ERC20 ABI
  const erc20Abi = [
    "function name() view returns (string)",
    "function balanceOf(address owner) view returns (uint256)",
  ];

  // Create promises for each token address
  const promises: Promise<void>[] = [];

  for (const tokenAddress of tokenAddresses) {
    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    promises.push(
      Promise.all([
        contract.name(), // Call the name() function
        getTokenBalance(contract, userAddress),
      ])
        .then(([name, balance]) => {
          if (Number(balance) > 0) {
            const camelCaseName = convertToCamelCase(name);
            balances[camelCaseName] = {
              tokenAddress,
              balance: Number(balance),
            };
          }
        })
        .catch((error) => {
          console.error(
            `Error retrieving contract name and balance for token ${tokenAddress} and user ${userAddress}:`,
            error
          );
        })
    );
  }

  await Promise.all(promises);

  return balances;
}