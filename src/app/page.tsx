"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Search, Settings, X } from "lucide-react";
import Crypto from "@/components/Crypto";
import DeFi from "@/components/DeFi";
import Transactions from "@/components/Transactions";
import { useAccount, useBalance } from "wagmi";
import { ChainIcon } from "@/components/Transfer";
import { CrossChainTransferForm } from "@/components/HandleTransfer";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Asset = {
  symbol: string;
  name: string;
  amount: number;
  chain: string;
  contractAddress: string;
};

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-2 ${
      isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
    }`}
  >
    {label}
  </button>
);

const WrongChainModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      
      <p className="text-xl font-bold text-red-600">You Cannot Bridge to same chain. Please choose different chain.</p>
      <button
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const Page = () => {
  const [currentTab, setCurrentTab] = useState<string>("crypto");
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showMessage, setShowChainMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.toLowerCase());
    },
    []
  );

  useEffect(() => {
    const handleDragStart = () => setIsDragging(true);
    const handleDragEnd = () => setIsDragging(false);

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  const handleChainDrop = (chainName: string, assetData: Asset) => {
    setSelectedChain(chainName);
    setSelectedAsset(assetData);
    setIsTransferFormOpen(true);
  };

  const { isConnected, address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col">
      <main className="flex-grow flex flex-col">
        <div className="flex items-center space-x-8 mb-6">
          <div>
            <h2 className="text-sm text-gray-400">Balance</h2>
            <p className="text-4xl font-bold">
              {isConnected
                ? `${
                    (Number(balanceData?.value) / 1e18).toFixed(4) || "0.0000 ETH"
                  } ETH`
                : "0.00 ETH"}
            </p>
          </div>
          <div className="flex space-x-4">
            <ChainIcon
              name="Optimism"
              onDrop={handleChainDrop}
              isDragging={isDragging}
              setShowChainMessage={setShowChainMessage}
            />
            <ChainIcon
              name="Arbitrum"
              onDrop={handleChainDrop}
              isDragging={isDragging}
              setShowChainMessage={setShowChainMessage}
            />
          </div>
        </div>

        <nav className="flex space-x-4 mb-6">
          <NavLink
            label="Crypto"
            isActive={currentTab === "crypto"}
            onClick={() => setCurrentTab("crypto")}
          />
          <NavLink
            label="DeFi"
            isActive={currentTab === "defi"}
            onClick={() => setCurrentTab("defi")}
          />
          <NavLink
            label="Transactions"
            isActive={currentTab === "transactions"}
            onClick={() => setCurrentTab("transactions")}
          />
        </nav>

        {currentTab === "crypto" && <Crypto searchTerm={searchTerm} />}
        {currentTab === "defi" && <DeFi searchTerm={searchTerm} />}
        {currentTab === "transactions" && (
          <Transactions searchTerm={searchTerm} />
        )}

        <CrossChainTransferForm
          isOpen={isTransferFormOpen}
          onClose={() => setIsTransferFormOpen(false)}
          chainName={selectedChain}
          asset={selectedAsset}
        />

        {showMessage && <WrongChainModal onClose={() => setShowChainMessage(false)} />}
      </main>
    </div>
  );
};

export default Page;
