import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export default function useCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // 🛡️ If already connected, we can stop the initial spinner
    if (socket.connected && coins.length > 0) setLoading(false);

    const handleFullUpdate = (fullData) => {
      // Logic check: Ensure fullData is an array
      if (!Array.isArray(fullData)) {
        console.error("Received data is not an array:", fullData);
        return;
      }

      const formatted = fullData.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toLowerCase(),
        name: coin.name,
        current_price: coin.current_price,
        image: coin.image, // 🚀 Uses the official CoinGecko URL
        market_cap_rank: coin.market_cap_rank,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap || 0,
      }));

      setCoins(formatted);
      setLoading(false); // 🔓 This stops the loading state
    };

    const handleError = () => {
      setError("Failed to connect to price server");
      setLoading(false);
    };

    // 🟢 Match the event name exactly with your backend emit
    socket.on("price-update-full", handleFullUpdate);
    socket.on("connect_error", handleError);

    return () => {
      // 🔴 Cleanup must match the event name above
      socket.off("price-update-full", handleFullUpdate);
      socket.off("connect_error", handleError);
    };
  }, [socket, coins.length]); // Added coins.length to dependency to help state transitions

  return { coins, loading, error };
}
