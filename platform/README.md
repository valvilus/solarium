# platform/

Monorepo for the Solarium SDK and Web3 applications. Managed via `pnpm` workspaces.

## Structure

```
packages/
  sdk/                 @solarium-labs/sdk — TypeScript client library
    src/
      client.ts        SolariumClient class wrapping all Anchor instructions
      storage.ts       IPFS (Pinata) and local storage providers
      manifest.ts      BYOL TaskManifest builder
      crypto.ts        Salt generation, commitment hashing (SHA-256)
      pda.ts           PDA derivation helpers
      types.ts         Shared type definitions

apps/
  web/                 Next.js 14 application (App Router, TailwindCSS)
    /explorer          Network Explorer — live tasks, node stakes, metrics
    /residao           ResiDAO — DAO construction audit demo
    /insurai           InsurAI — parametric insurance demo
    /dashboard         Developer dashboard — API keys, escrow, node management
    /docs              Protocol documentation pages
```

## Commands

```bash
pnpm install                               # Install all workspace dependencies
pnpm --filter @solarium-labs/sdk build      # Build the SDK
pnpm --filter web dev                       # Start the web app (http://localhost:3000)
pnpm --filter web build                     # Production build
```
