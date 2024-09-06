/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";





// Types for props
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

  const chainId = getChainId(config) 

 


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Updated `handleDrop` with proper TypeScript typing
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    // e.preventDefault();
    setIsDragOver(false);
    console.log("drropping")

    // Retrieve the dropped data
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log(data,chainId,name);
    if(data.chain==="arbitrum" && name==="Arbitrum")
      {
        return;
      }
      else if(data.chain==="optimism" && name==="Optimism")
      {
        
        return;
      }
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
            src={`${process.env.NEXT_PUBLIC_URL}/arbitrum_logo.png`}
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
      onDrop={(e) => handleDrop(e)} // Pass the address and config
    >
      {getIcon(name)}
    </div>
  );
};

