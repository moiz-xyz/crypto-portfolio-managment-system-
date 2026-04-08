import useTopCoins from "./useTopCoins";

export default function useWatchlist(watchlistIds) {
  const { coins, loading, error } = useTopCoins();

  // 🛡️ Ensure we filter the live coins based on the IDs in our database
  const watchedCoins = coins.filter(
    (coin) => watchlistIds.includes(coin.id) // Ensure coin.id matches 'bitcoin'
  );

  return { coins: watchedCoins, loading, error };
}
