import { RestClientV5 } from "bybit-api";
import { CoinBalance } from "./types/mainTypes";

export async function retrieveHeldCoins(): Promise<CoinBalance[]> {
  const bybitRest = new RestClientV5({
    key: process.env.BYBIT_KEY,
    secret: process.env.BTBIT_SECRET,
  });
  let availableCoins: CoinBalance[];
  const onlyCoinsWithValue = false;

  try {
    const result = await bybitRest.getAllCoinsBalance({ accountType: "SPOT" });
    availableCoins = result.result.balance.map((coin) => {
      if (!onlyCoinsWithValue || parseInt(coin.walletBalance) > 0) {
        return {
          coin: coin.coin,
          transferBalance: parseInt(coin.transferBalance),
        };
      }
    });
  } catch (error) {
    // console.log(error);
  }
  return availableCoins;
}

(async () => {
  const coins = await retrieveHeldCoins();
  console.log("coins: ", coins);
})();
