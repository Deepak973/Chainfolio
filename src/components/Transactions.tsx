import React, { useEffect, useState } from "react";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { useAccount } from "wagmi";



// Define the props type for TransactionRow
interface TransactionRowProps {
  tokenSymbol: string;
  tokenName: string;
  fromChain: string;
  toChain: string;
  price: number;
  txHash: string;
}

// Define the props type for Transactions component
interface TransactionsProps {
  searchTerm: string;
}

// TransactionRow component with TypeScript annotations
const TransactionRow: React.FC<TransactionRowProps> = ({
  tokenSymbol,
  tokenName,
  fromChain,
  toChain,
  price,
  txHash,
}) => (
  <div className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
    <div className="flex items-center">
      <div className="flex items-center space-x-3 w-1/3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {tokenSymbol[0]}
        </div>
        <div>
          <p className="text-white font-semibold">{tokenName}</p>
          <p className="text-gray-400 text-sm">{tokenSymbol}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-gray-300 w-1/3 justify-center">
        <span className="bg-gray-700 px-2 py-1 rounded">{fromChain}</span>
        <ArrowRightIcon size={16} />
        <span className="bg-gray-700 px-2 py-1 rounded">{toChain}</span>
      </div>
      <div className="flex items-center justify-end w-1/3">
        <div className="text-green-400 font-semibold mr-6">
         
        </div>
        <a
          href={`https://testnet.layerzeroscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
        >
          {txHash.slice(0, 6)}...{txHash.slice(-4)}
          <ExternalLinkIcon size={14} className="ml-1" />
        </a>
      </div>
    </div>
  </div>
);

// Transactions component with TypeScript annotations
const Transactions: React.FC<TransactionsProps> = ({ searchTerm }) => {
  const [transactions, setTransactions] = useState<TransactionRowProps[]>([]);
  const {address} = useAccount();

  useEffect(() => {
    // Fetch transactions from the API
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
           `https://scan-testnet.layerzero-api.com/v1/messages/wallet/${address?.toLowerCase()}?limit=100`
        );
        const data = await response.json();

        // Map the API data to TransactionRowProps
        const mappedTransactions = data.data.map((tx: any) => ({
          tokenSymbol: "USDC", // Assuming USDC for now
          tokenName: "USDC",   // Assuming USDC for now
          fromChain: tx.pathway.sender.chain, // Get the chain names from the API data
          toChain: tx.pathway.receiver.chain,
          price: parseFloat(tx.source.tx.gas), // Using gas as an example for price
          txHash: tx.source.tx.txHash,
        }));

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [address]);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Recent Transactions
      </h2>
      <div className="max-w-6xl mx-auto">
        {filteredTransactions.map((tx, index) => (
          <TransactionRow key={index} {...tx} />
        ))}
      </div>
    </div>
  );
};

export default Transactions;
