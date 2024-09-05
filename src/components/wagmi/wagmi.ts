import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrumSepolia,
  arbitrum,
  optimismSepolia,
  optimism,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: `${process.env.PROJECT_ID}`,
  chains: [
    arbitrumSepolia,
    arbitrum,
    optimismSepolia,
    optimism,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [arbitrumSepolia, arbitrum, optimismSepolia, optimism]
      : []),
  ],
  ssr: true,
});
