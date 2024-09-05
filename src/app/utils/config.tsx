import { http, createConfig } from "@wagmi/core";
import {
  arbitrumSepolia,
  arbitrum,
  optimismSepolia,
  optimism,
} from "@wagmi/core/chains";

export const config = createConfig({
  chains: [arbitrumSepolia, arbitrum, optimismSepolia, optimism],
  transports: {
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
    [optimismSepolia.id]: http(),
    [optimism.id]: http(),
  },
});
