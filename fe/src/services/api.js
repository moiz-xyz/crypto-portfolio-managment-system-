import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// 🧠 System Design: Attach JWT to every request for Protected Routes
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const authAPI = {
	// Updated to 'email' to match PostgreSQL schema
	login: async (email, password) => {
		const response = await api.post("/auth/login", { email, password });
		return response.data;
	},

	register: async (email, password) => {
		const response = await api.post("/auth/signup", { email, password });
		return response.data;
	},
};

export const portfolioAPI = {
	// GET all assets for the logged-in user
	get: async () => {
		const response = await api.get("/portfolio");
		return response.data;
	},

	// CREATE: Add a new asset to portfolio
	add: async (assetData) => {
		// assetData should be { asset_symbol, quantity, avg_buy_price }
		const response = await api.post("/portfolio", assetData);
		return response.data;
	},

	// DELETE: Remove an asset by its UUID
	remove: async (id) => {
		const response = await api.delete(`/portfolio/${id}`);
		return response.data;
	},
};

// Placeholder for Watchlist (Can be implemented in DB later)
export const watchlistAPI = {
	get: async () => {
		const response = await api.get("/watchlist");
		return response.data;
	},
};

export default api;
