import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SolariumClient } from "@solarium-labs/sdk";

export function useSolarium(): {
  client: SolariumClient | null;
  provider: AnchorProvider | null;
} {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) return { client: null, provider: null };

    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

    const client = new SolariumClient(provider);

    return { client, provider };
  }, [connection, wallet]);
}
