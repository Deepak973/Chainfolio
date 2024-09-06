/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { X } from "lucide-react";

type ChainIconProps = {
  name: string;
  onDrop: (chainName: string, data: any) => void;
  isDragging: boolean;
};

export const ChainIcon: React.FC<ChainIconProps> = ({
  name,
  onDrop,
  isDragging,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    onDrop(name, data);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "Optimism":
        return (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/op_logo.png`}
            alt="Optimism Logo"
            className="w-full h-full object-contain"
          />
        );
      case "Arbitrum":
        return (
          <img
            src={`${process.env.NEXT_PUBLIC_URL}/base_logo.png`}
            alt="Arbitrum Logo"
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

type CrossChainTransferFormProps = {
  isOpen: boolean;
  onClose: () => void;
  chainName: string | null;
  asset: { name: string; symbol: string } | null;
};

export const CrossChainTransferForm: React.FC<CrossChainTransferFormProps> = ({
  isOpen,
  onClose,
  chainName,
  asset,
}) => {
  const [step, setStep] = useState(1);

  const handleApprove = () => {
    setStep(step + 1);
  };

  if (!isOpen || !chainName || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Transfer {asset.symbol} to {chainName}
          </h3>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        {step === 1 ? (
          <div>
            <p>Approving transfer...</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={handleApprove}
            >
              Approve
            </button>
          </div>
        ) : (
          <div>
            <p>Transfer in progress...</p>
            <p>Step {step}</p>
          </div>
        )}
      </div>
    </div>
  );
};
