import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { useCurrency } from "../context/CurrencyContext";

import getColor from "../utils/color";

const PortfolioCoinRow = ({
  coin,
  isStarred,
  coinData,
  toggleWatchlist,
  toggleForm,
}) => {
  const { currency, formatCurrency } = useCurrency();

  // 🛡️ Safeguard: If no data exists for this coin in the portfolio, don't render the row.
  if (!coinData || !coin) {
    return null;
  }

  // --- 🧠 Logic: Calculations ---
  const totalQty = parseFloat(coinData.coins) || 0;
  const totalInv = parseFloat(coinData.totalInvestment) || 0;
  const currentPrice = parseFloat(coin.current_price) || 0;
  const currentValue = currentPrice * totalQty;

  // Avoid Division by Zero if investment is 0
  const profit =
    totalInv > 0 ? ((currentValue - totalInv) / totalInv) * 100 : 0;

  const color = getColor(profit);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-150 dark:hover:bg-gray-900 dark:border-gray-700">
      {/* Rank */}
      <td className="px-6 py-4 text-center font-medium text-gray-700 dark:text-white">
        {coin.market_cap_rank || "-"}
      </td>

      {/* Name & Icon */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full object-contain"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/32";
            }}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white leading-tight">
              {coin.name}
            </p>
            <p className="text-gray-500 text-xs uppercase dark:text-gray-400">
              {coin.symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Current Price */}
      <td className="px-6 py-4 font-medium">
        {formatCurrency(currentPrice * currency[1], 2)}
      </td>

      {/* Total Investment */}
      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
        {formatCurrency(totalInv * currency[1], 2)}
      </td>

      {/* Coins Purchased */}
      <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
        {totalQty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>

      {/* Current Value */}
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {formatCurrency(currentValue * currency[1], 2)}
      </td>

      {/* Profit/Loss % */}
      <td className={`px-6 py-4 font-bold ${color}`}>
        {profit > 0 ? "+" : ""}
        {profit.toFixed(2)}%
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className={`cursor-pointer transition-transform active:scale-125 ${
              !isStarred
                ? "text-gray-400 hover:text-amber-400"
                : "text-amber-400"
            }`}
            onClick={() => toggleWatchlist(coin.id, coin.name)}
          >
            {isStarred ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarOutlineIcon fontSize="small" />
            )}
          </button>

          <div className="flex gap-1">
            <button
              className="px-2 py-1 bg-green-600/10 text-green-600 text-xs font-bold rounded hover:bg-green-600 hover:text-white transition-all cursor-pointer"
              onClick={() => toggleForm(coin, "add")}
            >
              BUY
            </button>
            <button
              className="px-2 py-1 bg-red-600/10 text-red-600 text-xs font-bold rounded hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              onClick={() => toggleForm(coin, "remove")}
            >
              SELL
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default PortfolioCoinRow;
