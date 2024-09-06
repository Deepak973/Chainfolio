// Define a type for contract addresses
type ChainAddresses = {
  [chainId: number]: {
    chain_name: string;
    layerzero_endpoint: string;
    stargate_endpoint: string;
    aave_address_provider: string;
    usdc_address: string;
    sender_address: string;
    receiver_address: string;
    end_point_id: number;
  };
};

// Define the contract addresses object
const contractAddresses: ChainAddresses = {
  421614: {
    chain_name: "Arbitrum Sepolia",
    layerzero_endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f",
    stargate_endpoint: "0x0d7aB83370b492f2AB096c80111381674456e8d8",
    aave_address_provider: "0xB25a5D144626a0D488e52AE717A051a2E9997076",
    usdc_address: "0x3253a335E7bFfB4790Aa4C25C4250d206E9b9773",
    sender_address: "0x7fFCAEc622d7E944D6afAB8023623f43A7f2506b",
    receiver_address: "0x79C60085F901B39A21f563a440ccBcf6b0a33dD7",
    end_point_id: 40231
  },
  11155420: {
    chain_name: "Optimism Sepolia",
    layerzero_endpoint: "0x6EDCE65403992e310A62460808c4b910D972f10f",
    stargate_endpoint: "0x1E8A86EcC9dc41106d3834c6F1033D86939B1e0D",
    aave_address_provider: "0x36616cf17557639614c1cdDb356b1B83fc0B2132",
    usdc_address: "0x488327236B65C61A6c083e8d811a4E0D3d1D4268",
    sender_address: "0xb6dc5aE18a049faa697703fc46309Bf9e58652f4",
    receiver_address: "0xd3F6a5Fc97286cfB1E4c86106B42fb6Edbd5c830",
    end_point_id: 40232
  }
};

// Export the contract addresses
export default contractAddresses;
