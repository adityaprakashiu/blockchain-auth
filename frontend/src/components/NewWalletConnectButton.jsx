import React from 'react';

function NewWalletConnectButton({ onClick, isConnected }) {
  return (
    <div className="mt-4">
      <button 
        onClick={onClick}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        disabled={isConnected}
      >
        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      
      {isConnected && (
        <p className="text-blue-600 font-bold mt-2">
          Successfully connected to blockchain
        </p>
      )}
    </div>
  );
}

export default NewWalletConnectButton;