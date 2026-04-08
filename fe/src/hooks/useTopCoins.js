import { useGlobalCoins } from "../context/CoinContext";

export default function useTopCoins() {
  // Just grab everything from the global state
  const { coins, loading } = useGlobalCoins();

  return {
    coins,
    loading,
    error: null,
  };
}
