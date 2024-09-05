import React from "react";
import { ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';

const TransactionRow = ({ tokenSymbol, tokenName, fromChain, toChain, price, txHash }) => (
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
                <div className="text-green-400 font-semibold mr-6">${price.toFixed(2)}</div>
                <a
                    href={`https://etherscan.io/tx/${txHash}`}
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


const Transactions = ({ searchTerm }) => {
    const transactions = [
        { tokenSymbol: "ETH", tokenName: "Ethereum", fromChain: "Ethereum", toChain: "Optimism", price: 1820.50, txHash: "0x123...abc" },
        { tokenSymbol: "USDC", tokenName: "USD Coin", fromChain: "Arbitrum", toChain: "Base", price: 100.00, txHash: "0x456...def" },
        { tokenSymbol: "WBTC", tokenName: "Wrapped Bitcoin", fromChain: "Polygon", toChain: "Ethereum", price: 29450.75, txHash: "0x789...ghi" },
        { tokenSymbol: "DAI", tokenName: "Dai Stablecoin", fromChain: "Optimism", toChain: "Arbitrum", price: 500.00, txHash: "0xabc...123" },
    ];

    const filteredTransactions = transactions.filter(tx => 
        tx.tokenName.toLowerCase().includes(searchTerm) || 
        tx.tokenSymbol.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Recent Transactions</h2>
            <div className="max-w-6xl mx-auto">
                {filteredTransactions.map((tx, index) => (
                    <TransactionRow key={index} {...tx} />
                ))}
            </div>
        </div>
    );
};

export default Transactions;