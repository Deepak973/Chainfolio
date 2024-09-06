/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, Settings, X } from "lucide-react";
import Crypto from "@/components/Crypto";
import DeFi from "@/components/DeFi";
import Transactions from "@/components/Transactions";
import { useAccount, useBalance } from "wagmi";
import { ChainIcon, CrossChainTransferForm } from "@/components/Transfer";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Asset = {
  name: string;
  symbol: string;
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

const Page = () => {
  const [currentTab, setCurrentTab] = useState<string>("crypto");
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

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
                ? `$${
                    (Number(balanceData?.value) / 1e18).toFixed(4) || "0.0000"
                  }`
                : "$0.00"}
            </p>
          </div>
          <div className="flex space-x-4">
            <ChainIcon
              name="Optimism"
              onDrop={handleChainDrop}
              isDragging={isDragging}
            />
            <ChainIcon
              name="Base"
              onDrop={handleChainDrop}
              isDragging={isDragging}
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
      </main>
    </div>
  );
};

export default Page;
