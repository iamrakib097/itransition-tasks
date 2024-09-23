import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function DataTable({ seed, region, errorCount }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (newPage) => {
    setLoading(true);
    console.log(`Fetching data for page: ${newPage}`); // Log the page being fetched
    try {
      const response = await axios.get(
        "https://itransition-task-5-api.vercel.app/generate",
        {
          params: {
            seed: `${seed}-${region}`,
            page: newPage,
            region,
            errorCount,
          },
        }
      );
      console.log("Response data:", response.data); // Log the response data
      setData((prevData) => [...prevData, ...response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(0);
    fetchData(0);
  }, [seed, region, errorCount]);

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(["Index", "ID", "Name", "Address", "Phone"].join(","));
    data.forEach((row) => {
      const values = [row.index, row.id, row.name, row.address, row.phone];
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
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
          const nextPage = page + 1;
          setPage(nextPage);
          fetchData(nextPage);
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

        {loading && (
          <div className="text-center py-4">
            <div className="loader"></div>
            <style jsx>{`
              .loader {
                border: 6px solid #f3f3f3;
                border-top: 6px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        )}

        <div className="grid gap-4">
          {data.map((row, index) => (
            <div
              key={`${row.id}-${index}`} // Ensure unique keys
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
