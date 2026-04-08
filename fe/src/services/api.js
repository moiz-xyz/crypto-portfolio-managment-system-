import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
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
  // 1. Fetching all assets
  get: async () => {
    const response = await api.get("/portfolio");
    /**
     * 🧠 Transform: Your frontend App.js expects an object { btc: {...}, eth: {...} }
     * but Postgres returns an array [ {coin_id: 'btc', ...} ].
     * We convert it here so your Dashboard logic doesn't break.
     */
    const portfolioMap = {};
    response.data.forEach((item) => {
      portfolioMap[item.coin_id] = {
        totalInvestment: parseFloat(item.total_investment),
        coins: parseFloat(item.quantity),
      };
    });
    return portfolioMap;
  },

  /**
   * 2. Add/Update Asset
   * Matches: addCoin(id, totalInvestment, coins) in App.jsx
   */
  update: async (coinId, data) => {
    const payload = {
      coin_id: coinId,
      symbol: coinId.toUpperCase(),
      quantity: data.coins,
      avg_buy_price: data.totalInvestment / data.coins, // Calculating avg price for backend
    };
    await api.post("/portfolio", payload);

    // Return the full updated portfolio to refresh the App.js state
    return portfolioAPI.get();
  },
};

export const watchlistAPI = {
  get: async () => {
    const response = await api.get("/watchlist");
    return { watchlist: response.data };
  },
  toggle: async (coinId) => {
    await api.post("/watchlist/toggle", { coin_id: coinId });
    const updatedList = await api.get("/watchlist");
    return { watchlist: updatedList.data };
  },
};

export default api;
