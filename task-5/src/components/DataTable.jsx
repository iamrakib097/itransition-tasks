import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function DataTable({ seed, region, errorCount }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/generate", {
        params: { seed, page, region, errorCount },
      });
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

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {
        setPage((prevPage) => prevPage + 1); // Increment page
        fetchData();
      }}
      hasMore={true}
      loader={<h4 className="text-center py-4 text-gray-500">Loading...</h4>}
    >
      <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-200 text-gray-800">
          <tr className="border-b border-gray-300">
            <th className="p-4 text-left">Index</th>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="p-4 border-b border-gray-300">{row.index}</td>
              <td className="p-4 border-b border-gray-300">{row.id}</td>
              <td className="p-4 border-b border-gray-300 break-words">
                {row.name}
              </td>
              <td className="p-4 border-b border-gray-300 break-words">
                {row.address}
              </td>
              <td className="p-4 border-b border-gray-300 break-words">
                {row.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  );
}
