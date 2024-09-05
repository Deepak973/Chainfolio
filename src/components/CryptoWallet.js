/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Settings, X } from "lucide-react";
import Crypto from "./Crypto";
import DeFi from "./DeFi";
import Transactions from "./Transactions";
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`pb-2 ${
        isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
      }`}
    >
      {children}
    </Link>
  );
};

const ChainIcon = ({ name, onDrop, isDragging }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    onDrop(name, data);
  };

  const getIcon = (name) => {
    switch (name) {
      case "Optimism":
        return (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/op_logo.png`}
            alt="Optimism Logo"
            className="w-full h-full object-contain"
          />
        );
      case "Base":
        return (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/base_logo.png`}
            alt="Base Logo"
            className="w-full h-full object-contain"
          />
        );
      default:
        return "🟥";
    }
  };

  return (
    <div
      className={`w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 ${
        isDragOver ? "scale-110 border-2 border-blue-500" : ""
      } ${isDragging ? "animate-pulse shadow-lg shadow-blue-500/50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {getIcon(name)}
    </div>
  );
};

const CrossChainTransferForm = ({ isOpen, onClose, chainName, asset }) => {
  const [step, setStep] = useState(1);

  const handleApprove = () => {
    setStep(step + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer to {chainName}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <p className="mb-4">
          Asset: {asset.name} ({asset.symbol})
        </p>
        <div className="space-y-4">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                step >= 1 ? "bg-blue-500" : "bg-gray-600"
              } mr-4 flex items-center justify-center`}
            >
              1
            </div>
            <span>Remove Liquidity</span>
            {step === 1 && (
              <button
                onClick={handleApprove}
                className="ml-auto bg-blue-500 px-4 py-2 rounded"
              >
                Approve
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                step >= 2 ? "bg-blue-500" : "bg-gray-600"
              } mr-4 flex items-center justify-center`}
            >
              2
            </div>
            <span>Approve to LayerZero</span>
            {step === 2 && (
              <button
                onClick={handleApprove}
                className="ml-auto bg-blue-500 px-4 py-2 rounded"
              >
                Approve
              </button>
            )}
          </div>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                step >= 3 ? "bg-blue-500" : "bg-gray-600"
              } mr-4 flex items-center justify-center`}
            >
              3
            </div>
            <span>Send token cross chain</span>
            {step === 3 && (
              <button
                onClick={onClose}
                className="ml-auto bg-blue-500 px-4 py-2 rounded"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CryptoWallet = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("/crypto");
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
  }, []);

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

  useEffect(() => {
    if (pathname && pathname !== "/crypto") {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  const handleChainDrop = (chainName, assetData) => {
    setSelectedChain(chainName);
    setSelectedAsset(assetData);
    setIsTransferFormOpen(true);
  };

  const { isConnected, address } = useAccount();
  const { data: balanceData } = useBalance({ address });

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col">
      {/* <header className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coins, NFTs, apps..."
              className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
        </div>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </header> */}

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
          <NavLink href="/crypto">Crypto</NavLink>
          <NavLink href="/defi">DeFi</NavLink>
          <NavLink href="/transactions">Transactions</NavLink>
        </nav>

        {/* {currentPath === "/" && (
          <div className="text-center py-12">
            <div className="flex justify-center space-x-2 mb-4">
              {["C", "🔗", "O"].map((icon, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl"
                >
                  {icon}
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-2">
              Add crypto to get started
            </h3>
            <p className="text-gray-400 mb-4">
              Buy or send some crypto to your wallet to get started
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
              Add Crypto
            </button>
          </div>
        )} */}

        {currentPath === "/crypto" && <Crypto searchTerm={searchTerm} />}
        {currentPath === "/defi" && <DeFi searchTerm={searchTerm} />}
        {currentPath === "/transactions" && (
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

export default CryptoWallet;
