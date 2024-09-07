import { initializeClient } from "@/app/utils/publicClient";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ERC20ABI from "@/components/ERC20ABI.json";
import { getContract } from "viem";

// Define types for props
interface APYComparisonCardProps {
  token: string;
  name: string;
  optimismAPY: number;
  baseAPY: number;
  balance: string;
}

interface APYDisplayProps {
  chain: string;
  apy: number;
}

interface DeFiProps {
  searchTerm: string;
}

const APYComparisonCard: React.FC<APYComparisonCardProps> = ({
  token,
  name,
  optimismAPY,
  baseAPY,
  balance,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ token, symbol: token, name: name, isDefi: true })
    );
  };

  return (
    <div
      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl cursor-move transition-shadow duration-300"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
            {token[0]}
          </div>
          <h3 className="text-xl font-semibold text-white">
  {balance} <span className="ml-2">{token}</span>
</h3>
          
        </div>
        <div className="flex space-x-4">
          <APYDisplay chain="Optimism" apy={optimismAPY} />
          <APYDisplay chain="Arbitrum" apy={baseAPY} />
        </div>
      </div>
    </div>
  );
};

const APYDisplay: React.FC<APYDisplayProps> = ({ chain, apy }) => {
  const bgColor = chain === "Optimism" ? "bg-red-500" : "bg-blue-500";
  return (
    <div
      className={`${bgColor} rounded-lg p-3 text-center w-24 h-24 flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-300`}
    >
      <p className="text-xs font-medium text-white mb-1">{chain}</p>
      <p className="text-2xl font-bold text-white">{apy}%</p>
    </div>
  );
};

const DeFi: React.FC<DeFiProps> = ({ searchTerm }) => {
  const [apyData, setApyData] = useState([
    { token: "AUSDC", name: "USD Coin", optimismAPY: 3.5, baseAPY: 4.2, balance: "0" },
    { token: "ADAI", name: "Dai", optimismAPY: 3.2, baseAPY: 3.8, balance: "0" },
    { token: "AWBTC", name: "Wrapped Bitcoin", optimismAPY: 2.9, baseAPY: 3.3, balance: "0" },
  ]);

  const { address } = useAccount();

  useEffect(() => {
    const fetchBalances = async () => {
      const clientOptimism = initializeClient(11155420); // Optimism chain ID
      const newApyData = [...apyData];

      for (let i = 0; i < newApyData.length; i++) {
        const tokenData = newApyData[i];
        const contract = getContract({
          address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
          abi: ERC20ABI,
          client: clientOptimism,
        });

        
        try {
          const balance = await contract.read.balanceOf([address as `0x${string}`]);
          if (typeof balance === 'string') {
            tokenData.balance = (BigInt(balance) / BigInt(1e6)).toString();
          } else {
            console.error(`Unexpected type for balance: ${typeof balance}`);
          }
        } catch (error) {
          console.error(`Error fetching balance for ${tokenData.token}:`, error);
        }
      }

      setApyData(newApyData);
    };

    if (address) {
      fetchBalances();
    }
  }, [address]);

  const filteredData = apyData.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.token.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        APY Comparison: Optimism vs Arbitrum
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
        {filteredData.map((data) => (
          <APYComparisonCard key={data.token} {...data} />
        ))}
      </div>
    </div>
  );
};

export default DeFi;
