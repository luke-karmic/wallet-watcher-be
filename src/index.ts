import { EthValueConversionCache } from "./types/mainTypes";
import { transferHandler } from "./events/transfer-handler";
import dotenv from "dotenv";
import { sendOpeningMessage } from "./notifications/telegram";
import {
  calculateDollarValue,
  calculateEthValueWithDecimals,
  calculatePriceImpact,
  updateConversionRateCache,
} from "./utils/helpers";
import Decimal from "decimal.js";
import amqp, { Connection, ConsumeMessage } from "amqplib";

dotenv.config();

const processMessage = async (
  message: ConsumeMessage | null,
  pairCache: Map<string, any>
) => {
  const eventMessage = JSON.parse(message.content.toString());
  let priceDataCache: EthValueConversionCache = {};

  if (eventMessage) {
    try {
      priceDataCache = await updateConversionRateCache(
        eventMessage.tokenAddress,
        priceDataCache,
        pairCache
      );
      const priceImpact = await calculatePriceImpact(
        eventMessage.tokenAddress,
        eventMessage.amount
      );
      const ethValue = calculateEthValueWithDecimals(
        new Decimal(eventMessage.amount),
        eventMessage.decimals,
        new Decimal(priceDataCache[eventMessage.tokenAddress].ethConversionRate)
      );
      const dollarValue = calculateDollarValue(
        new Decimal(eventMessage.amount),
        new Decimal(
          priceDataCache[eventMessage.tokenAddress].ethConversionRate
        ),
        eventMessage.decimals,
        new Decimal(priceDataCache[eventMessage.tokenAddress].ethPrice)
      );
      transferHandler({
        ...eventMessage,
        ethValue,
        priceImpact,
        dollarValue,
      });
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }
};

(async () => {
  try {
    const connection: Connection = await amqp.connect(
      process.env.RABBITMQ_CONNECTION_STRING
    );
    let pairCache: Map<string, any> = new Map(); // Cache to store pair data
    const channel = await connection.createChannel();

    const queueName = "ERC20";

    await channel.assertQueue("ERC20", {
      exclusive: false,
      durable: false,
      autoDelete: true,
    });
    await channel.prefetch(1);

    channel.consume(queueName, async (message) => {
      await processMessage(message, pairCache), { noAck: false };
      channel.ack(message); // Acknowledge the message after successful processing
    });
  } catch (error) {
    console.error(`Error connecting to RabbitMQ: ${error.message}`);
  }
})();
