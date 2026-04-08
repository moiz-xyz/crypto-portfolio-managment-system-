import axios from "axios";
import { getIO } from "./socket.js";
import "dotenv/config";

export const startPriceEngine = () => {
  console.log("⚙️ Price Engine Started...");
  setInterval(async () => {
    try {
      // 🚀 Changed to 'markets' endpoint to get 50+ coins automatically
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 50, // Gets the top 50 coins!
            page: 1,
            sparkline: false,
          },
          headers: {
            Accept: "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
          },
        }
      );

      // We emit the whole array now because it contains images and names!
      const io = getIO();
      io.emit("price-update-full", data);
      console.log("Broadcasted top 50 coins with metadata");
    } catch (error) {
      console.error("❌ Engine Error:", error.message);
    }
  }, 30000);
};
