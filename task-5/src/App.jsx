import React, { useState } from "react";
import ErrorSlider from "./components/ErrorSlider";
import SeedInput from "./components/SeedInput";
import DataTable from "./components/DataTable";

function App() {
  const [region, setRegion] = useState("USA");
  const [seed, setSeed] = useState("");
  const [errorCount, setErrorCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Fake Data Generator
      </h1>
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1">
              <label
                htmlFor="region"
                className="block text-lg font-semibold mb-2"
              >
                Region:
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option value="USA">USA</option>
                <option value="Poland">Poland</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            <SeedInput seed={seed} setSeed={setSeed} />
          </div>
          <ErrorSlider errorCount={errorCount} setErrorCount={setErrorCount} />
        </div>
        <DataTable seed={seed} region={region} errorCount={errorCount} />
      </div>
    </div>
  );
}

export default App;
