import React, { useState } from 'react';

const CryptoCard = ({ symbol, name, price }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ symbol, name, price }));
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 shadow-lg cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105' : 'opacity-100 scale-100'
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
          {symbol[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{symbol}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

const Crypto = ({ searchTerm }) => {
  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 30000.00 },
    { symbol: 'ETH', name: 'Ethereum', price: 2000.00 },
    { symbol: 'ADA', name: 'Cardano', price: 0.50 },
  ];

  const filteredAssets = cryptoAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm) || 
    asset.symbol.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <CryptoCard key={asset.symbol} {...asset} />
        ))}
      </div>
    </div>
  );
};

export default Crypto;