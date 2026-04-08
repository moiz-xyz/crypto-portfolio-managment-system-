import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

const Form = ({
  title,
  buttonText,
  initialQuantity, // 🚀 Added this prop
  coinData,
  toggleForm,
  action,
  portfolio,
}) => {
  const { formatCurrency, currency } = useCurrency();
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(
    (coinData.current_price * currency[1]).toFixed(2)
  );

  // 🛠️ Updated to match your new "Confirm Sale" button text
  const isSelling = buttonText === "Confirm Sale";
  const [warning, setWarning] = useState(null);

  return (
    <div className="flex w-screen justify-center items-center">
      <div className="fixed top-1/5 w-fit shadow-2xl p-8 rounded-xl bg-white mx-6 dark:bg-gray-800">
        <div className="flex justify-between gap-36 mb-4">
          <h1 className="text-xl font-bold">{title}</h1>
          <div
            className="text-gray-600 hover:text-black cursor-pointer dark:text-gray-100"
            onClick={toggleForm}
          >
            <CloseIcon />
          </div>
        </div>

        {/* 📊 Balance Indicator: Shows what you currently own */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-slate-700 rounded-lg flex justify-between items-center">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-300">
            CURRENT HOLDINGS:
          </p>
          <p className="font-mono font-bold text-blue-800 dark:text-blue-100">
            {initialQuantity || 0} {coinData.symbol.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={coinData.image}
            alt={coinData.name}
            className="w-12 rounded-full"
          />
          <div className="flex flex-col">
            <h2 className="font-medium">{coinData.name}</h2>
            <p className="uppercase text-xs">{coinData.symbol}</p>
            <p className="text-xs">
              Live Price: {formatCurrency(coinData.current_price * currency[1])}
            </p>
          </div>
        </div>

        <form className="my-6">
          <div className="flex flex-col mb-3">
            <span>
              Amount <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                if (warning) setWarning(null);
                const inputValue = e.target.value;
                if (/^[0-9.]*$/.test(inputValue)) setAmount(inputValue);
              }}
              className="border px-2 py-2.5 rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="0.00"
            />
          </div>

          <div className="flex flex-col mb-5">
            <span>
              {isSelling
                ? `Sell Price (${currency[0]})`
                : `Buy Price (${currency[0]})`}
              <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={price}
              onChange={(e) => {
                if (warning) setWarning(null);
                const inputValue = e.target.value;
                if (/^[0-9.]*$/.test(inputValue)) setPrice(inputValue);
              }}
              className="border px-2 py-2.5 rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="0.00"
            />
          </div>

          <p className="text-wrap text-center font-medium">
            {Number.isNaN(Number(amount) * Number(price)) ? (
              <span className="text-red-500">Invalid numbers</span>
            ) : !warning ? (
              `${
                isSelling ? "Total Sale Value" : "Total Investment"
              }: ${formatCurrency(Number(amount) * Number(price))}`
            ) : (
              <span className="text-red-500 text-sm">{warning}</span>
            )}
          </p>
        </form>

        <button
          className={`${
            isSelling
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } w-full text-white py-3 rounded-md transition-colors font-bold`}
          onClick={() => {
            const numAmount = Number(amount);
            const numPrice = Number(price);

            if (!numAmount || numAmount <= 0) {
              setWarning("Please enter a valid amount.");
              return;
            }

            if (!numPrice || numPrice <= 0) {
              setWarning("Please enter a valid price.");
              return;
            }

            if (isSelling) {
              if (numAmount > (initialQuantity || 0)) {
                setWarning(
                  `Insufficient balance. You only have ${initialQuantity} coins.`
                );
                return;
              }
            }

            // Normalizing price to USD before sending to backend
            action(
              coinData.id,
              (numAmount * numPrice) / currency[1],
              numAmount
            );
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Form;
