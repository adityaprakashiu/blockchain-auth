import React, { useState } from "react";

const UserActions = ({ handleAction, isLoading }) => {
  const [userAddress, setUserAddress] = useState("");

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">User Management</h3>
      
      <input
        type="text"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md mb-4"
        placeholder="Enter user address (0x...)"
      />

      <div className="flex gap-4">
        <button
          onClick={() => handleAction("assign", userAddress)}
          className={`w-full bg-green-600 hover:bg-green-500 p-3 rounded-md ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          Assign Admin
        </button>

        <button
          onClick={() => handleAction("revoke", userAddress)}
          className={`w-full bg-yellow-600 hover:bg-yellow-500 p-3 rounded-md ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          Revoke Admin
        </button>

        <button
          onClick={() => handleAction("delete", userAddress)}
          className={`w-full bg-red-600 hover:bg-red-500 p-3 rounded-md ${isLoading ? "opacity-50" : ""}`}
          disabled={isLoading}
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserActions;
