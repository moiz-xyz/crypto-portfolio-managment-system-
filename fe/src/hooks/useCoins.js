import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function useCoins(portfolio) {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// 1. Initialize Socket Connection
		const socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			console.log("✅ Connected to Real-time Price Engine");
			setLoading(false);
		});

		// 2. Listen for the 'price-update' event from your Backend
		socket.on("price-update", (livePrices) => {
			// livePrices looks like: { BTC: 65000, ETH: 3500, ... }
			
			setCoins((prevCoins) => {
				// We map the backend symbols to the structure your UI expects
				const updatedCoins = Object.keys(livePrices).map((symbol) => {
					// Find the existing coin data to preserve metadata (name, rank)
					const existing = prevCoins.find(c => c.symbol.toUpperCase() === symbol);
					
					return {
						id: existing?.id || symbol.toLowerCase(), // mapping symbol to id
						symbol: symbol.toLowerCase(),
						name: existing?.name || symbol,
						current_price: livePrices[symbol], // The live ticking price
						market_cap_rank: existing?.market_cap_rank || 0
					};
				});
				return updatedCoins;
			});
		});

		socket.on("connect_error", () => {
			setError("Failed to connect to price server");
			setLoading(false);
		});

		return () => socket.disconnect();
	}, []);

	return { coins, loading, error };
}
