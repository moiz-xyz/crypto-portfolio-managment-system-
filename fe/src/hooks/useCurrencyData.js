import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext"; // 👈 Use shared context

export default function useCurrencyData() {
  const [currencyData, setCurrencyData] = useState({
    rates: { USD: 1, INR: 83.3 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = useSocket(); // 👈 Consuming the singleton

  useEffect(() => {
    if (!socket) return;

    // If the socket is already connected, stop the loading spinner immediately
    if (socket.connected) setLoading(false);

    const handlePriceUpdate = (data) => {
      // Check if this specific broadcast contains the currency rates
      if (data.rates) {
        setCurrencyData(data);
        setLoading(false);
      }
    };

    const handleError = () => {
      setError("Currency stream disconnected");
      setLoading(false);
    };

    // 👂 Listen to the SHARED channel
    socket.on("price-update", handlePriceUpdate);
    socket.on("connect_error", handleError);

    // 🧹 Clean up only the LISTENERS, not the connection
    return () => {
      socket.off("price-update", handlePriceUpdate);
      socket.off("connect_error", handleError);
    };
  }, [socket]);

  return { currencyData, loading, error };
}
