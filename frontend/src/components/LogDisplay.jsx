import React from "react";

const LogDisplay = ({ logs, title, isLoading }) => {
  if (isLoading) return <p>Loading {title}...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md my-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto max-h-72">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="p-3 border-b border-gray-700">
              <p><strong>User:</strong> {log.user || log.user_address}</p>
              <p><strong>Message:</strong> {log.message || log.ip}</p>
              <p><strong>Timestamp:</strong> {log.timestamp}</p>
            </div>
          ))
        ) : (
          <p>No logs available.</p>
        )}
      </div>
    </div>
  );
};

export default LogDisplay;
