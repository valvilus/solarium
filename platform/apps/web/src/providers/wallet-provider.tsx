"use client";

import React, { type ReactNode, useMemo, createContext, useContext, useState, useEffect } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import "@solana/wallet-adapter-react-ui/styles.css";

export type NetworkType = "localnet" | "devnet";

interface NetworkContextState {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
  rpcUrl: string;
}

const NetworkContext = createContext<NetworkContextState | undefined>(undefined);

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a WalletContextProvider");
  }
  return context;
}

export function WalletContextProvider({ children }: { readonly children: ReactNode }): ReactNode {
  const [network, setNetworkState] = useState<NetworkType>("localnet");

  useEffect(() => {
    const saved = localStorage.getItem("SOLARIUM_NETWORK") as NetworkType;
    if (saved === "localnet" || saved === "devnet") {
      setNetworkState(saved);
    }
  }, []);

  const setNetwork = (newNetwork: NetworkType) => {
    localStorage.setItem("SOLARIUM_NETWORK", newNetwork);
    setNetworkState(newNetwork);
  };

  const rpcUrl =
    network === "localnet"
      ? process.env.NEXT_PUBLIC_LOCALNET_RPC || "http://127.0.0.1:8899"
      : process.env.NEXT_PUBLIC_DEVNET_RPC || "https://api.devnet.solana.com";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <NetworkContext.Provider value={{ network, setNetwork, rpcUrl }}>
      <ConnectionProvider endpoint={rpcUrl}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </NetworkContext.Provider>
  );
}
