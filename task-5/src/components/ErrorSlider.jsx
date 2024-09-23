import React from "react";

export default function ErrorSlider({ errorCount, setErrorCount }) {
  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setErrorCount(Math.min(value, 1000));
  };

  const handleNumberChange = (e) => {
    const value = Math.max(0, Math.min(parseFloat(e.target.value), 1000));
    setErrorCount(value);
  };

  return (
    <div>
      <label htmlFor="errorCount" className="block text-lg font-semibold mb-2">
        Error Count:
      </label>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Slider Input */}
        <input
          type="range"
          id="errorCount"
          min="0"
          max="1000"
          step="0.1"
          value={errorCount}
          onChange={handleSliderChange}
          className="flex-1"
        />
        {/* Number Input */}
        <input
          type="number"
          min="0"
          max="1000"
          step="0.1"
          value={errorCount}
          onChange={handleNumberChange}
          className="w-24 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
    </div>
  );
}
