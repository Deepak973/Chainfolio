import { getPublicClient } from "@wagmi/core";
import { config } from "@/app/utils/config";
import {
  arbitrumSepolia,
  arbitrum,
  optimismSepolia,
  optimism,
} from "@wagmi/core/chains";

// Define a union type of allowed chain IDs
type AllowedChainIds =
  | typeof arbitrumSepolia.id
  | typeof arbitrum.id
  | typeof optimismSepolia.id
  | typeof optimism.id;

// Utility function to initialize a client for a specific chain
export const initializeClient = (chainId: AllowedChainIds) => {
  const client = getPublicClient(config, { chainId });
  return client;
};

// Example usage: initializing clients for different chains
export const initializeClientsForAllChains = () => {
  const arbitrumSepoliaClient = initializeClient(arbitrumSepolia.id);
  const arbitrumClient = initializeClient(arbitrum.id);
  const optimismSepoliaClient = initializeClient(optimismSepolia.id);
  const optimismClient = initializeClient(optimism.id);

  return {
    arbitrumSepoliaClient,
    arbitrumClient,
    optimismSepoliaClient,
    optimismClient,
  };
};
