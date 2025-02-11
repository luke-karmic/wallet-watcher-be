import { PeriodicUpdateData } from "../types/mainTypes";

export const generatePeriodicUpdateHTML = (
  data: PeriodicUpdateData
): string => {
  const tokenHtmlArray = data.tradedProjects.map((project) => {
    return `<i>🔑 Token</i>: <b><a href="${project.iconUrl}">${project.symbol}</a></b> - Trigger Settings: <i>ETH Value Percentage</i> > <code>${project.thresholds.ethAlertThreshold}</code> ETH - <i>Price Impact</i> >  <code>${project.thresholds.priceImpactThreshold}%</code>`;
  });

  const nftHtmlArray = data.nftProjects.map((project) => {
    return `<i>🔑 NFT Project</i>: <b><a href="${project.nftProjectUrl}">${project.name}</a></b>`;
  });

  const tokenHtml = tokenHtmlArray.join("\n");
  const nftHtml = nftHtmlArray.join("\n");

  const fullHtml = `
  Hello, Luke.
≠
Welcome to <a href=""><b>Wallet Watcher!</b></a>

Here are the smart contracts detected from your wallet with the following address <code>${data.walletAddress}</code> which I'm watching, and their current trigger settings:

${tokenHtml}

And the NFT's I am also watching from your wallet:
${nftHtml}

You can update the configuration thresholds within the panel found here: <a href="https://walletwatcher.app/panel">https://walletwatcher.app/panel</a>

You can also use the following BOT commands to modify the thresholds:

<b>/tokenThresholds</b> - Retrieves all current ERC20 thresholds
<b>/nftThresholds</b> - Retrieves all current NFT thresholds
<b>/setThreshold</b> <code>{smartContractAddress} {amount}</code> - Set the ETH alert threshold
<b>/setpriceimpactthreshold</b> <code>{smartContractAddress} {amount}</code> - Set the price impact threshold

You are currently running <code>Free version</code>, see the <a href="">premium features</a> and <a href="">upgrade here</a>.

Features <b>Coming soon!</b>:
<s>👉 ERC20 Wallet Watching - <i>Large Whale transasctions</i></s>
<s>👉 ERC721 NFT wallet watching - Floor price alerts</s>
<s>👉 Alert thresholds Telegram BOT commands</s>
<s>👉 Redesign Front end for alerts HTML image-based</s>
👉 ERC20 Wallet watching - <i>Big Wick informer</i>
👉 Alert thresholds Web App panel
👉 Alter the HTML design based on the significance of the alert
👉 Sell assets directly from Telegram
👉 Bybit, Bitget and Binance Exchange connection
👉 Support Arbitrum One, Optimism, BSC, TRON network contracts
👉 Monitor open positions
👉 Ideal Leverage calculation

  `;

  return fullHtml;
};
