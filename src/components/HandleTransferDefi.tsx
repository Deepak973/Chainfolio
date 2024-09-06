import React, { useState } from "react";
import { X } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { BigNumber } from "ethers";
import ERC20ABI from "@/components/ERC20ABI.json";
import StargateEndpointABI from "@/components/StargateEndpointABI.json";
import ChainFolioABI from "@/components/ChainFolioABI.json";
import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { initializeClient } from "@/app/utils/publicClient";
import contractAddresses from "@/ContractAddresses";

type CrossChainTransferFormProps = {
    isOpen: boolean;
    onClose: () => void;
    chainName: string | null;
    asset: Asset | null;
};

type Asset = {
    symbol: string;
    name: string;
    amount: number;
    chain: string;
    contractAddress: string;
};

export const CrossChainTransferFormDefi: React.FC<CrossChainTransferFormProps> = ({
    isOpen,
    onClose,
    chainName,
    asset,
}) => {
    const [step, setStep] = useState(1);
    const { writeContractAsync } = useWriteContract();
    const { address } = useAccount();
    const [amountUSDC, setAmount] = useState<number | "">("");
    const [transactionHash, setTransactionHash] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAmount = Number(e.target.value);
        setAmount(inputAmount);

        if (asset && inputAmount > asset.amount) {
            setErrorMessage(`Amount exceeds your current balance of ${asset.amount} ${asset.symbol}`);
        } else {
            setErrorMessage(null);
        }
    };

    // Step 1: Approve A tokens
    const handleApproveA = async () => {
        console.log("Approving A tokens...");
        // Your logic for approving A tokens
        setStep(2);
    };

    // Step 2: Remove Liquidity from Aave
    const handleRemoveLiquidity = async () => {
        console.log("Removing Liquidity from Aave...");
        // Your logic for removing liquidity
        setStep(3);
    };

    // Step 3: Approve tokens for LayerZero
    const handleApproveLayerZero = async () => {
        console.log("Approving tokens for LayerZero...");
        // Your logic for LayerZero approval
        setStep(4);
    };

    // Step 4: Bridge the token
    const handleBridgeToken = async () => {
        console.log("Bridging the token...");
        // Your logic for bridging tokens
        setStep(5); // Optional: You can reset or show a success message
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

                <input
                    type="text"
                    value={amountUSDC}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
                />
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

                {/* Step 1: Approve A Tokens */}
                <div className="mt-4">
                    <div className={`flex items-center ${step >= 1 ? "text-white" : "text-gray-400"}`}>
                        <div className="flex-shrink-0">
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    step >= 1 ? "bg-blue-500" : "bg-gray-500"
                                }`}
                            >
                                1
                            </span>
                        </div>
                        <p className="ml-4">Approve A Tokens</p>
                    </div>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
                            step === 1 ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleApproveA}
                        disabled={step !== 1}
                    >
                        Approve A Tokens
                    </button>
                </div>

                {/* Step 2: Remove Liquidity */}
                <div className="mt-4">
                    <div className={`flex items-center ${step >= 2 ? "text-white" : "text-gray-400"}`}>
                        <div className="flex-shrink-0">
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    step >= 2 ? "bg-blue-500" : "bg-gray-500"
                                }`}
                            >
                                2
                            </span>
                        </div>
                        <p className="ml-4">Remove Liquidity from Aave</p>
                    </div>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
                            step === 2 ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleRemoveLiquidity}
                        disabled={step !== 2}
                    >
                        Remove Liquidity
                    </button>
                </div>

                {/* Step 3: Approve for LayerZero */}
                <div className="mt-4">
                    <div className={`flex items-center ${step >= 3 ? "text-white" : "text-gray-400"}`}>
                        <div className="flex-shrink-0">
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    step >= 3 ? "bg-blue-500" : "bg-gray-500"
                                }`}
                            >
                                3
                            </span>
                        </div>
                        <p className="ml-4">Approve for LayerZero</p>
                    </div>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
                            step === 3 ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleApproveLayerZero}
                        disabled={step !== 3}
                    >
                        Approve LayerZero
                    </button>
                </div>

                {/* Step 4: Bridge the Token */}
                <div className="mt-4">
                    <div className={`flex items-center ${step >= 4 ? "text-white" : "text-gray-400"}`}>
                        <div className="flex-shrink-0">
                            <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    step >= 4 ? "bg-blue-500" : "bg-gray-500"
                                }`}
                            >
                                4
                            </span>
                        </div>
                        <p className="ml-4">Bridge the Token</p>
                    </div>
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 ${
                            step === 4 ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleBridgeToken}
                        disabled={step !== 4}
                    >
                        Bridge Tokens
                    </button>
                </div>

                {/* Display Transaction Hash */}
                {transactionHash && (
                    <p className="mt-4 text-white">
                        Transaction Hash:{" "}
                        <a href={`https://testnet.layerzeroscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                            {transactionHash}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default CrossChainTransferFormDefi;
