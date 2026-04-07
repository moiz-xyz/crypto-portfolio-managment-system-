import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function useTopCoins() {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// 🔌 Connect to your Backend Engine
		const socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			console.log("✅ TopCoins connected to Price Engine");
			setLoading(false);
		});

		// 🧠 System Design: Listen to the same broadcast as the Dashboard
		socket.on("price-update", (livePrices) => {
			// Convert the object { BTC: 65000, ... } into an array for the UI
			const updatedTopCoins = Object.keys(livePrices)
				.filter(key => key !== 'timestamp') // Remove metadata
				.map((symbol, index) => ({
					id: symbol.toLowerCase(),
					symbol: symbol.toLowerCase(),
					name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol,
					current_price: livePrices[symbol],
					market_cap_rank: index + 1, // Simulated rank based on your engine order
					price_change_percentage_24h: 0 // Optional: can be added to backend engine
				}));

			setCoins(updatedTopCoins);
		});

		socket.on("connect_error", () => {
			setError("Unable to stream top coins");
			setLoading(false);
		});

		// 🧹 Cleanup on unmount
		return () => socket.disconnect();
	}, []);

	return { coins, loading, error };
}
