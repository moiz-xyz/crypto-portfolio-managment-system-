import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // 🚀 This handles the data seen in your network screenshot
    const handleFullUpdate = (fullData) => {
      if (!Array.isArray(fullData)) {
        console.warn("Received data is not an array");
        return;
      }

      const formatted = fullData.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toLowerCase(),
        name: coin.name,
        current_price: coin.current_price,
        image: coin.image, // ✅ Images will now work!
        market_cap_rank: coin.market_cap_rank,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap || 0,
      }));

      setCoins(formatted);
      setLoading(false); // 🔓 This stops the "Loading..." state
    };

    // 🟢 MUST match the backend emit name
    socket.on("price-update-full", handleFullUpdate);

    return () => {
      // 🔴 Cleanup
      socket.off("price-update-full", handleFullUpdate);
    };
  }, [socket]);

  return (
    <CoinContext.Provider value={{ coins, loading }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useGlobalCoins = () => useContext(CoinContext);
