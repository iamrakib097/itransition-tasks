import React from "react";

export default function SeedInput({ seed, setSeed }) {
  const handleRandomSeed = () => {
    setSeed(Math.random().toString(36).substring(2, 15));
  };

  const handleChange = (e) => {
    setSeed(e.target.value);
  };

  return (
    <div className="flex-1">
      <label htmlFor="seed" className="block text-lg font-semibold mb-2">
        Seed:
      </label>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          id="seed"
          type="text"
          value={seed}
          onChange={handleChange}
          placeholder="Enter seed value"
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <button
          onClick={handleRandomSeed}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Random Seed
        </button>
      </div>
    </div>
  );
}
