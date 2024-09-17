export const formatTimestamp = (timestamptz) => {
  const date = new Date(timestamptz);

  // Format the time (12-hour format with leading zeros for hours, minutes, and seconds)
  const time = date.toLocaleTimeString("en-US", {
    hour12: false, // for 24-hour format; change to `true` for 12-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format the date (day, abbreviated month, full year)
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${time}, ${day} ${month}, ${year}`;
};
