# ChainFolio

**ChainFolio** is a multichain portfolio manager designed to optimize and manage your ERC20 tokens across different blockchains. Our platform helps you find the best yield opportunities, bridge tokens seamlessly, and manage your investments from one place.

## Features

- **Yield Optimization**: Compare yields across chains and get suggestions on where to invest for the highest returns.
- **Drag-and-Drop Bridging**: Easily bridge tokens between chains with an intuitive drag-and-drop interface.
- **Real-Time Data**: Fetch and track user positions from Aave protocols using Hypersync.
- **Advanced Cross-Chain Integration**: Leverage LayerZero for secure token bridging and Stargate V2 for native asset transfers with automated actions.

## Technologies Used

- **Frontend**: Built with [Next.js](https://nextjs.org/) for performance, [Tailwind CSS](https://tailwindcss.com/) for styling, and [Framer Motion](https://www.framer.com/api/motion/) for animations.
- **Smart Contracts**: Developed, tested, and deployed using [Foundry](https://github.com/gakonst/foundry).
- **Cross-Chain Bridging**: Integrated [LayerZero](https://layerzero.network/) and [Stargate V2](https://stargate.finance/) for bridging tokens and handling native asset transfers. Real-time data is managed with [Hypersync](https://hypersync.xyz/).

## Smart Contract addresses

1. SmartContract on Arbitrum :
2. SmartContract on Optimism :

## Sponsers Used

1. LayerZero
   Implementation Link:
   Sender Contract on Optimism : https://sepolia-optimism.etherscan.io/address/0xb6dc5aE18a049faa697703fc46309Bf9e58652f4#code
   Receiver Contract on Optimism : https://sepolia-optimism.etherscan.io/address/0xd3F6a5Fc97286cfB1E4c86106B42fb6Edbd5c830#code

   Sender Contract on Arbitrum : https://sepolia.arbiscan.io/address/0x7fFCAEc622d7E944D6afAB8023623f43A7f2506b#code
   Receiver Contract on Arbitrum : https://sepolia.arbiscan.io/address/0x79C60085F901B39A21f563a440ccBcf6b0a33dD7#code
   
   Usage:
   We have used Layzer Zero For Birdiging Native aasests from one chain to another.
   We have used LzCompose to execute External contract on the receiver contract after a message is executed.
   we are depositiog the tokens to Aave on destination chain using LzCompose In one transaction only.


2. HyperSync
   Implementation Link: https://envio-apis.vercel.app/
   Usage: 
   We have used HyperSync to get the postion of users in Aaave 
   and analyze the Best APY

## find Our backend Code in this Repo

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/chainfolio.git
   ```
