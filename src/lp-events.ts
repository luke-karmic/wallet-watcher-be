import { ethers } from "ethers";
import { fetchContractABIWithRateLimit } from "wallet-watcher-common";

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/D3PHHd9zmfUT8qTO-WN4z20wIvqN7eYL"
  );
  const abi = await fetchContractABIWithRateLimit(
    "0xc364ecf5a501983fe1deaa490d9d056397a0fbb0"
  );
  const contract = new ethers.Contract(
    "0xc364ecf5a501983fe1deaa490d9d056397a0fbb0",
    abi,
    provider
  );

  try {
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();

    // Replace 'addLiquidity' with the name of the event you want to query
    const eventName = "addLiquidity";

    // Get past events from the contract
    const filter = contract.filters[eventName]();
    const events = await contract.queryFilter(filter, latestBlock - 10000); // Replace 10000 with the number of blocks you want to query back

    console.log("Found events:");
    events.forEach((event) => {
      console.log(event.args); // This will print the event's data
    });
  } catch (error) {
    console.error("Error querying contract:", error);
  }
})();
