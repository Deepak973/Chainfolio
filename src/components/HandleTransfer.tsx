// Cross-chain Transfer Form component


/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { X } from "lucide-react";
import { Address, getContract } from "viem";
import ChainFolioABI from "@/components/ChainFolioABI.json";
import { getChainId } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { initializeClient } from "@/app/utils/publicClient";
import contractAddresses from "@/ContractAddresses";
import ERC20ABI from "@/components/ERC20ABI.json";
import { encodeAbiParameters } from 'viem'
import { useAccount, useWriteContract } from "wagmi";
import StargateEndpointABI from "@/components/StargateEndpointABI.json"
import { BigNumber } from "ethers";

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

  
  export const CrossChainTransferForm: React.FC<CrossChainTransferFormProps> = ({
    isOpen,
    onClose,
    chainName,
    asset,
  }) => {
    const [step, setStep] = useState(1);
    const { writeContractAsync } = useWriteContract();
    const { address } = useAccount();
    const [amountUSDC, setAmount] = useState<number | "">("");
    const [transactionHash, setTransactionHash] =useState("");
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

  
  
    const handleApprove = async () => {
        if (!asset) {
            console.error("Asset is not defined");
            return;
          }
       // Get the chain ID and initialize the client for the current chain
       const chainId = getChainId(config);
       const client = initializeClient(chainId);
   
       // Set up the contract instance using the provided ChainFolio contract ABI and client
   
       
      console.log("amount",amountUSDC);
      const numericAmountUSDC = Number(amountUSDC);
      const amountUSDCWithDecimals = numericAmountUSDC * 1_000_000; 
      const userBalance = asset.amount;
      if (numericAmountUSDC > userBalance) {
        console.error("Amount exceeds balance");
        return;
      }
     
   
       // Define the destination chain ID based on the current chain
       let destinationChainID: number;
       if (chainId === 421614) {
         destinationChainID = 11155420;
       } else {
         destinationChainID = 421614;
       }
   
       // Define arguments to pass to the contract interaction
       const stargatePoolUSDC = contractAddresses[chainId]["stargate_endpoint"];
       const destinationEndpointId =
         contractAddresses[destinationChainID]["end_point_id"]; // Arbitrum's endpoint ID
       const amount = amountUSDCWithDecimals; // 1 USDC (assuming 6 decimal places)
       const sourceChainPoolToken =
         contractAddresses[chainId]["usdc_address"]; // USDC token on the source chain
       const oftOnDestination =
         contractAddresses[destinationChainID]["usdc_address"]; // Destination USDC contract
       const tokenReceiver =
       address; // Destination receiver address
       const isDefi = false; // Example boolean flag for DeFi use case
   
   
       console.log(tokenReceiver,oftOnDestination);
       // Prepare the message with parameters
   
       const composeMsg = encodeAbiParameters(
         [
           { type: 'address' },
           { type: 'address' },
           { type: 'bool' }
         ],
         [tokenReceiver as Address, oftOnDestination as Address, isDefi]
       )
   
       console.log(composeMsg);
      
       // // Approve the transfer using the ERC20 `approve` method
       console.log(address);
       const txApprove = await writeContractAsync({
         address: sourceChainPoolToken as Address,
         account: address,
         abi: ERC20ABI,
         functionName: "approve",
         args: [contractAddresses[chainId]["stargate_endpoint"], amount], // Approving 10 USDC
       });
   
       console.log(txApprove);
   
    //    Call the contract to `prepareTakeTaxi`
    //   First, call prepareTakeTaxi to get the needed parameters
   
      type SendParam = {
       
     };
     
     type MessagingFee = {
       
     };
     
     // Define the return type of prepareTakeTaxi
     type PrepareTakeTaxiResponse = [
       BigNumber,    // valueToSend
       SendParam,    // sendParam
       MessagingFee  // messagingFee
     ];
   
   
      const contract = getContract({
       address: contractAddresses[chainId]["sender_address"] as `0x${string}`,
       abi: ChainFolioABI.abi,
       client: client,
     });
   
     console.log(amount);
     const txTakeTaxi  = await contract.read.prepareTakeTaxi([stargatePoolUSDC,
       destinationEndpointId,
       amount,
       contractAddresses[destinationChainID]["receiver_address"], // Sender
       composeMsg]) as PrepareTakeTaxiResponse;
   
     console.log(txTakeTaxi);
   
   
   
   
   // Log the transaction response to see the output
   console.log("Transaction sent", txTakeTaxi);

   
   
   
   // Extract the needed parameters from the transaction response.
   // Assuming the `txTakeTaxi` returns the necessary parameters like `valueToSend`, `sendParam`, `messagingFee`.
   // You need to adjust this based on how txTakeTaxi returns the result.
   const valueToSend = BigInt(txTakeTaxi[0].toString());
   // Now, use the returned parameters in sendToken
   const sendTokens = await writeContractAsync({
     address: contractAddresses[chainId]["stargate_endpoint"] as `0x${string}`,
     abi: StargateEndpointABI,
     functionName: "sendToken",
     args: [
       txTakeTaxi[1],        // SendParam from prepareTakeTaxi
       txTakeTaxi[2],     // MessagingFee from prepareTakeTaxi
       contractAddresses[destinationChainID]["receiver_address"], // Receiver address
     ],
     value: valueToSend , // Use valueToSend for the value to send with the transaction
   });
   
   console.log("sendToken Transaction sent", sendTokens);
   setTransactionHash(sendTokens);
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
            <input
            type="text"
            value={amountUSDC}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="bg-gray-700 text-white px-4 py-2 rounded-md w-full"
            />
  {errorMessage && (
    <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
  )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={handleApprove}
            >
              Approve
            </button>
          </div>
        )  : (
            <div>
              <p>Transfer in progress...</p>
              <p>Step {step}</p>
              <p>
            {transactionHash ? (
            <a href={`https://testnet.layerzeroscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                {`Transaction Hash: ${transactionHash}`}
            </a>
            ) : (
            "nill"
            )}
            </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default CrossChainTransferForm;