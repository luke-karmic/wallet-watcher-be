import TelegramBot, {
  SendMessageOptions,
  SendPhotoOptions,
} from "node-telegram-bot-api";
import {
  DEXTradedContract,
  NFTTradedContract,
  DeliveryMetaData,
  TelegramDeliveryMode,
} from "../types/mainTypes";
import puppeteer from "puppeteer";
import { generatePeriodicUpdateHTML } from "./notification-html";
import sharp from "sharp";

// Define a function to send a notification via Telegram
export const sendTelegramNotification = async (
  message: string
): Promise<void> => {
  const token = "[REMOVED]"; // todo: Fix secret
  const bot = new TelegramBot(token, { polling: false });

  const options: SendMessageOptions = {
    parse_mode: "Markdown", // Optional: Specify the message parsing mode (e.g., HTML)
    disable_notification: false,
  };

  try {
    await bot.sendMessage("-984135239", message, options);
    console.log("Telegram notification sent successfully.");
  } catch (error) {
    console.error("Error sending Telegram notification:", error.message);
  }
};

export const sendAlert = async <T extends Record<string, any>>(
  notificationData: DeliveryMetaData<T>
): Promise<void> => {
  const botToken = "[REMOVED]"; // todo: Fix secret
  const bot = new TelegramBot(botToken, { polling: false });

  try {
    const { mode, captionInfo, generateHTML, height } = notificationData;
    const html = await generateHTML();

    if (mode === TelegramDeliveryMode.Image) {
      const options: SendPhotoOptions = {
        parse_mode: "HTML", // Optional: Specify the message parsing mode (e.g., HTML)
        disable_notification: false,
        caption: generateCaption(captionInfo),
      };
      const covertedImage = await convertHTMLToImage(html, height);
      await bot.sendPhoto("-984135239", covertedImage, options);
    } else {
      const options: SendMessageOptions = {
        parse_mode: "HTML", // Optional: Specify the message parsing mode (e.g., HTML)
        disable_notification: false,
      };
      await bot.sendMessage("-984135239", html, options);
    }
    console.log("Telegram notification sent successfully.");
  } catch (error) {
    console.error("Error sending Telegram notification:", error.message);
  }
};

const generateCaption = <T extends Record<string, any>>(
  captionInfo?: T
): string => {
  if (!captionInfo) {
    return "";
  }

  const caption = Object.entries(captionInfo)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" ");

  return `<a href="${captionInfo.url}"><i>${caption}</i> Click to view</a>`;
};

export async function convertHTMLToImage(
  html: string,
  height: number
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 450,
    height,
  });

  await page.setContent(html);
  await page.waitForTimeout(2000);
  const screenshot = await page.screenshot({ fullPage: true });

  await browser.close();
  const trimmedImageBuffer = await sharp(screenshot)
    .trim({
      background: undefined,
      threshold: 6,
    }) // Trim whitespace
    .toBuffer();

  return trimmedImageBuffer;
}

export const sendOpeningMessage = async (
  walletAddress: string,
  nftProjects: NFTTradedContract[],
  tradedProjects: DEXTradedContract[]
): Promise<void> => {
  sendAlert({
    mode: TelegramDeliveryMode.Text,
    height: 650,
    generateHTML: async () =>
      generatePeriodicUpdateHTML({
        nftProjects: nftProjects,
        tradedProjects: tradedProjects,
        walletAddress,
      }),
  });
};
