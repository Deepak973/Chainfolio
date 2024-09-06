import { initializeClient } from "@/app/utils/publicClient";
import React, { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import ERC20ABI from "@/components/ERC20ABI.json"
import { getChainId } from '@wagmi/core'
import { config } from "@/app/utils/config";



// Interface for the crypto assets
interface CryptoAsset {
  symbol: string;
  name: string;
  amount: number;
  chain: string;
  contractAddress: string;
}

interface CryptoCardProps {
  symbol: string;
  name: string;
  amount: number;
  chain: string;
  contractAddress: string;
}

const WrongChainModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
    
      <p className="text-xl font-bold text-red-600">Switch Chain to Drip</p>
      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const CryptoCard: React.FC<CryptoCardProps> = ({ symbol, name, amount,chain ,contractAddress}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const chainId = getChainId(config) 
  const [isDraggable, setIsDraggable] =useState(true);
  const [showMessage, setShowChainMessage] = useState(false);


  useEffect(()=>{
    if(chain==="arbitrum" && chainId!==421614)
      {
        console.log("Please swith to correct chain")
        setIsDraggable(false);
    
        return;
      }
      else if(chain==="optimism" && chainId!==11155420)
      {
        console.log("Please swith to correct chain")
        setIsDraggable(false);
       
  
        return;
      }

  },[])


  



  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ symbol, name, amount,chain ,contractAddress})
    );
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  type ContractAddress = `0x${string}`;
  type Chain = "arbitrum" | "optimism";
  const handleDrip = async (contractAddress:ContractAddress ,chain:Chain) => {

    console.log(chain,chainId);
    if(chain==="arbitrum" && chainId!==421614)
    {
      console.log("Please swith to correct chain")
      // await switchChain(config, { chainId: arbitrumSepolia.id });
      setShowChainMessage(true);
    
      return;
    }
    else if(chain==="optimism" && chainId!==11155420)
    {
      console.log("Please swith to correct chain")
      // await switchChain(config, { chainId: optimismSepolia.id });
      setShowChainMessage(true);

      return;
    }
    console.log("dripping!!",contractAddress)
    const tx = await writeContractAsync({
      address: contractAddress,
      account: address as `0x${string}`,
      abi: ERC20ABI,
      functionName: "mint",
      args: [address,10000000], //10 USDC
    });

    console.log(tx)

    const client =initializeClient(chainId);
    const receipt = await client.waitForTransactionReceipt({ hash: tx });
    console.log(receipt);
  
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 shadow-lg cursor-move transition-all duration-200 ${
        isDragging ? "opacity-50 scale-105" : "opacity-100 scale-100"
      }`}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
        <img
            src={`${process.env.NEXT_PUBLIC_URL}/usdc_logo.png`}
            alt="Optimism Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{chain}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">${amount.toFixed(2)}</p>
      </div>
      <div className="mt-4">
      <div className="relative inline-block">
      <div className="relative group">
  <button
    onClick={() => handleDrip(contractAddress as `0x${string}`, chain as Chain)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
  >
    Drip
  </button>

  {/* Tooltip */}
  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 px-4 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity text-center">
    Click to get 10 USDC
  </div>
</div>
  
</div>
      </div>
      {showMessage && <WrongChainModal onClose={() => setShowChainMessage(false)} />}
      
    </div>
  );
};

interface CryptoProps {
  searchTerm: string;
}


const Crypto: React.FC<CryptoProps> = ({ searchTerm }) => {
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([
    {
      symbol: "USDC",
      name: "USDC",
      amount: 0,
      chain: "arbitrum",
      contractAddress: "0x3253a335E7bFfB4790Aa4C25C4250d206E9b9773",
    },
    {
      symbol: "USDC",
      name: "USDC",
      amount: 0,
      chain: "optimism",
      contractAddress: "0x488327236B65C61A6c083e8d811a4E0D3d1D4268",
    },
  ]);

  // Initialize clients for Arbitrum and Optimism
  const clientArbitrum = initializeClient(421614);
  const clientOptimism = initializeClient(11155420);

  // Get the connected account address
  const { address } = useAccount();


  // Function to fetch balance using `getContract` from viem
  const fetchBalances = async () => {
    const updatedAssets = await Promise.all(
      cryptoAssets.map(async (asset) => {
        try {
          const contract = getContract({
            address: asset.contractAddress as `0x${string}`, // Type assertion to satisfy TypeScript
            abi: ERC20ABI,
            client: asset.chain === "arbitrum" ? clientArbitrum : clientOptimism,
          });

          const balance = await contract.read.balanceOf([address as `0x${string}`]);
          const balanceBigInt = BigInt(balance as unknown as string);

          // Convert balance from BigInt to a number, adjusting for USDC's 6 decimals
          const formattedBalance = parseFloat(
            (balanceBigInt / BigInt(10 ** 6)).toString()
          );
          console.log(formattedBalance);
          // Return the updated asset with real-time balance
          return { ...asset, amount: formattedBalance };
        } catch (error) {
          console.error(`Error fetching balance for ${asset.chain}:`, error);
          return asset; // Return the asset unchanged in case of an error
        }
      })
    );
    setCryptoAssets(updatedAssets); // Update state with the new balances
  };

  useEffect(() => {
    if(address)
    {
    fetchBalances();
    }
  }, [address]);

  // Filter assets based on the search term
  const filteredAssets = cryptoAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
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
