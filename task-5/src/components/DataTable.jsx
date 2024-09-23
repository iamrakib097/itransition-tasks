import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function DataTable({ seed, region, errorCount }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://itransition-task-5-api.vercel.app/generate",
        {
          params: { seed, page, region, errorCount },
        }
      );
      setData((prevData) => [...prevData, ...response.data]); // Append new data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setData([]); // Clear data when seed, region, or errorCount changes
    setPage(0); // Reset page
    fetchData(); // Fetch new data
  }, [seed, region, errorCount]);

  const exportToCSV = () => {
    const csvRows = [];
    // Add header row
    csvRows.push(["Index", "ID", "Name", "Address", "Phone"].join(","));

    // Add data rows
    data.forEach((row) => {
      const values = [row.index, row.id, row.name, row.address, row.phone];
      csvRows.push(values.join(","));
    });

    // Create a blob from the CSV data
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={exportToCSV}
      >
        Export to CSV
      </button>

      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          setPage((prevPage) => prevPage + 1); // Increment page
          fetchData();
        }}
        hasMore={true}
        loader={<h4 className="text-center py-4 text-gray-500">Loading...</h4>}
      >
        <div className="grid grid-cols-5 bg-gray-200 text-gray-800 p-4 gap-2">
          <div className="font-bold">Index</div>
          <div className="font-bold">ID</div>
          <div className="font-bold">Name</div>
          <div className="font-bold">Address</div>
          <div className="font-bold">Phone</div>
        </div>

        <div className="grid gap-4">
          {data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-5 bg-white p-4 border-b border-gray-300 gap-2 hover:bg-gray-50"
            >
              <div className="break-words">{row.index}</div>
              <div className="break-words">{row.id}</div>
              <div className="break-words">{row.name}</div>
              <div className="break-words">{row.address}</div>
              <div className="break-words">{row.phone}</div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
