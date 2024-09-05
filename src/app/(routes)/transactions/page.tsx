"use client";

import CryptoWallet from "@/components/CryptoWallet";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function CryptoPage() {
  return <CryptoWallet />;
}
