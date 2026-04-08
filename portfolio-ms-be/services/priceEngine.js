import axios from "axios";
import { getIO } from "./socket.js";
import "dotenv/config";

let lastPrices = null;

const fetchPrices = async () => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          sparkline: false,
        },
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
        },
      }
    );

    lastPrices = data;
    const io = getIO();
    if (io) {
      io.emit("price-update-full", data);
      console.log(
        `✅ Broadcasted ${
          data.length
        } coins at ${new Date().toLocaleTimeString()}`
      );
    }
  } catch (error) {
    console.error("❌ Price Engine Error:", error.message);
  }
};

export const startPriceEngine = () => {
  console.log("⚙️ Price Engine Initialized...");

  fetchPrices();

  setInterval(fetchPrices, 30000);
};

// Optional: Export a getter for the socket to use on new connections
export const getLastPrices = () => lastPrices;
