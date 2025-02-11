import Decimal from "decimal.js";
import { sendAlert } from "../notifications/telegram";
import {
  MappedTransferEvent,
  TransferInfo,
  TelegramDeliveryMode,
  PriceImpactColour,
  NotificationType,
} from "../types/mainTypes";
import { calculateSupplyPercentage } from "../utils/helpers";
import { NotificationBuilder } from "../notifications/notification-builder";
import { Notification } from "../types/mainTypes";
import connectToDatabase from "../utils/db";
import mongoose from "mongoose";
import {
  NotificationDesignRepository,
  UserRepository,
} from "wallet-watcher-models";

export const transferHandler = async (transferEvent: MappedTransferEvent) => {
  await connectToDatabase();

  const notificationDesignRepository = new NotificationDesignRepository(
    mongoose
  );
  const userRepository = new UserRepository(mongoose);

  try {
    const thresholds = await userRepository.getContractThresholds(
      process.env.METAMASK_WALLET,
      transferEvent.tokenAddress
    );

    const design = await notificationDesignRepository.findByName(
      "design-uniswap-v2"
    );

    const transferInfo: TransferInfo = {
      transferSupplyPercentage: await calculateSupplyPercentage(
        BigInt(transferEvent.amount.toString()),
        transferEvent
      ),
      ethValue: transferEvent.ethValue,
      dollarValue: transferEvent.dollarValue,
    };
    const priceImpact = transferEvent.priceImpact
      ? new Decimal(transferEvent.priceImpact)
      : new Decimal(0);
    if (
      transferInfo.ethValue.greaterThan(thresholds.ethAlertThreshold) ||
      priceImpact.greaterThan(thresholds.priceImpactThreshold)
    ) {
      const formattedEthValue = transferInfo.ethValue.toFixed(3) + " ETH";
      const dollarValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(transferInfo.dollarValue.toNumber());
      const priceImpactColour = getPriceImpactcolour(priceImpact);
      const formattedPriceImpact = priceImpact.toFixed(3) + "%";
      const formattedTotalSupply =
        transferInfo.transferSupplyPercentage.toFixed(3) + "%";

      const notification: Notification = {
        title: "Whale Alert",
        assetName: transferEvent.symbol,
        assetImageUrl: transferEvent.iconUrl,
        header: {
          message: formattedPriceImpact,
          subMessage: formattedTotalSupply,
        },
        type: NotificationType.DEX,
        rowData: [
          {
            ethValue: {
              label: "(ETH) Transaction Value Total",
              value: formattedEthValue,
              subValue: "0.26%",
            },
            dollarValue: {
              label: "($) Transaction Value Total",
              value: dollarValue,
              subValue: "0.26%",
            },
          },
        ],
      };

      await sendAlert({
        mode: TelegramDeliveryMode.Image,
        generateHTML: async () =>
          NotificationBuilder.build(design, notification),
        height: 650,
        captionInfo: {
          url: `https://www.dextools.io/app/en/ether/pair-explorer/${transferEvent.tokenAddress}`,
          symbol: transferEvent.symbol,
          priceImpact: formattedPriceImpact,
          ethValue: formattedEthValue,
        },
      });
    }
  } catch (err) {
    console.error("Error: Transfer Handler failed", err);
  }
};

const getPriceImpactcolour = (priceImpact: Decimal) => {
  if (priceImpact.greaterThan(0) && priceImpact.lessThan(0.5)) {
    return PriceImpactColour.Green;
  } else if (priceImpact.greaterThan(0.5) && priceImpact.lessThan(1)) {
    return PriceImpactColour.Yellow;
  } else {
    return PriceImpactColour.Red;
  }
};
