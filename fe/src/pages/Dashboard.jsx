import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Form from "../components/Form";
import PortfolioTable from "../components/PortfolioTable";
import CoinGeckoAttribution from "../components/CoinGeckoAttribution";
import { useCurrency } from "../context/CurrencyContext";

import { useGlobalCoins } from "../context/CoinContext"; // 🚀 Use Global Context
import useChart from "../hooks/useChart";
import PieChartComponent from "../components/PieChartComponent";
import BarChartComponent from "../components/BarChartComponent";

const Dashboard = ({
  watchlist,
  toggleWatchlist,
  portfolio,
  form,
  addCoin,
  toggleForm,
  removeCoin,
  coinData,
}) => {
  const [action, setAction] = useState("");
  const { currency, formatCurrency } = useCurrency();

  // 🔌 Use the global state instead of a local hook listener
  const { coins, loading, error } = useGlobalCoins();
  const chart = useChart(portfolio, coins);

  const handleToggleForm = (coin, actionType) => {
    setAction(actionType);
    toggleForm(coin);
  };

  // --- 🧠 Logic: Real-time Recomputation ---
  const totalInvestment = Object.keys(portfolio).reduce((acc, coinId) => {
    return acc + (portfolio[coinId].totalInvestment || 0);
  }, 0);

  const currentValue = Object.keys(portfolio).reduce((acc, coinId) => {
    // We look for the coin in our global list (id matches 'bitcoin', 'ethereum', etc.)
    const liveData = coins.find((c) => c.id === coinId.toLowerCase());
    if (liveData && portfolio[coinId]) {
      return acc + portfolio[coinId].coins * liveData.current_price;
    }
    return acc;
  }, 0);

  const profitAmt = currentValue - totalInvestment;
  const profitPct =
    totalInvestment > 0 ? (profitAmt / totalInvestment) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Syncing Portfolio...</p>
        </div>
      </div>
    );
  }

  return !form ? (
    <div className="bg-slate-50 min-h-screen w-full p-4 sm:p-8 dark:bg-slate-900 transition-colors duration-300">
      {/* --- Header Section --- */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
            Portfolio Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live market tracking active
          </p>
        </div>
        <button
          onClick={() => handleToggleForm(null, "add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
        >
          <AddIcon fontSize="small" /> Add Asset
        </button>
      </div>

      {/* --- Top Metric Cards --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Portfolio Value
          </h2>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-black text-slate-900 dark:text-white">
              {formatCurrency(currentValue * currency[1])}
            </p>
            <div
              className={`flex items-center px-2 py-1 rounded-lg text-sm font-bold ${
                profitPct < 0
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {profitPct < 0 ? (
                <TrendingDownIcon fontSize="small" />
              ) : (
                <TrendingUpIcon fontSize="small" />
              )}
              <span>{profitPct.toFixed(2)}%</span>
            </div>
          </div>
          <p
            className={`mt-2 text-sm font-medium ${
              profitAmt < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {profitAmt < 0 ? "-" : "+"}
            {formatCurrency(Math.abs(profitAmt) * currency[1])} total profit
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Total Invested
          </h2>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {formatCurrency(totalInvestment * currency[1])}
          </p>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Across {Object.keys(portfolio).length} assets
          </p>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Asset Allocation
          </h3>
          <div className="h-64">
            <PieChartComponent chart={chart} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Investment Performance
          </h3>
          <div className="h-64">
            <BarChartComponent chart={chart} />
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <PortfolioTable
            loading={loading}
            error={error}
            coins={coins}
            toggleWatchlist={toggleWatchlist}
            watchlist={watchlist}
            portfolio={portfolio}
            message={
              Object.keys(portfolio).length === 0
                ? "No assets in your portfolio yet."
                : ""
            }
            toggleForm={handleToggleForm}
            totalInvestment={totalInvestment}
            currentValue={currentValue}
          />
        </div>
        <div className="text-center py-6">
          <CoinGeckoAttribution />
        </div>
      </div>
    </div>
  ) : (
    <Form
      title={action === "add" ? "Add New Asset" : "Update Asset"}
      buttonText={action === "add" ? "Add to Portfolio" : "Update"}
      coinData={coinData}
      toggleForm={toggleForm}
      action={action === "add" ? addCoin : removeCoin}
      portfolio={portfolio}
    />
  );
};

export default Dashboard;
