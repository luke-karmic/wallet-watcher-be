import { getNFTData } from "./utils/helpers";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/db";
import { sendAlert } from "./notifications/telegram";
import { TelegramDeliveryMode } from "./types/mainTypes";
import mongoose from "mongoose";
import { UserRepository } from "wallet-watcher-models";
import { NFTProjectModel } from "wallet-watcher-models/dist/models/nft-project.model";
dotenv.config();

/**
  // GOAL: Determine whether NFT project value suddenly increases
  // What defines this?
  // Sudden increase in volume (AKA sales or transactions) -> Determined by TX count over x period
  // Sudden increase in floor price
  // Sudden reduction in floor thickness
 */
const processNftProjectData = async (
  contracts: NFTProjectModel[],
  userRepository: UserRepository
) => {
  // Update the data for every contract and every interval for that contract if needed
  for (let i = 0; i < contracts.length; i++) {
    const contractData = await getNFTData(contracts[i].address);
    const intervals = Object.keys(contractData.intervalData);
    if (!contractData) continue;

    const contractThresholds = await userRepository.getContractThresholds(
      process.env.METAMASK_WALLET,
      contractData.address
    );

    for (let j = 0; j < intervals.length; j++) {
      const interval = intervals[j];
      const currentIntervalData = contractData.intervalData[interval];

      if (
        currentIntervalData.floorPriceEth >
        contractThresholds.floorPriceThreshold
      ) {
        await sendAlert({
          mode: TelegramDeliveryMode.Image,
          height: 650,
          generateHTML: async () => {
            return "";
          },
          captionInfo: {
            url: `https://opensea.io/assets/${contractData.address}/`,
            floorPrice: currentIntervalData.floorPriceEth,
            floorPriceThreshold: contractThresholds.floorPriceThreshold,
          },
        });
      }
    }
  }
};

// const SCRIPT_UPDATE_INTERVAL = 600000; // 10 minutes in milliseconds

(async () => {
  await connectToDatabase();
  const userRepository = new UserRepository(mongoose);
  const nftProjects: NFTProjectModel[] = await userRepository.getAllNFTProjects(
    process.env.METAMASK_WALLET
  );
  await processNftProjectData(nftProjects, userRepository);

  // setInterval(async () => {
  // }, SCRIPT_UPDATE_INTERVAL); // 600000 = 10 minuga tes
})();
