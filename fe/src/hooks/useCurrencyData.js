import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

export default function useCurrencyData() {
	const [currencyData, setCurrencyData] = useState({ rates: { USD: 1, INR: 83.3 } });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			setLoading(false);
		});

		// 🧠 System Design: Catching the broadcast from our Backend
		socket.on("price-update", (data) => {
			if (data.rates) {
				setCurrencyData(data);
				setLoading(false);
			}
		});

		socket.on("connect_error", () => {
			setError("Currency stream disconnected");
			setLoading(false);
		});

		return () => socket.disconnect();
	}, []);

	return { currencyData, loading, error };
}
