# platform/apps/web/

Next.js 14 frontend for the Solarium Protocol. Serves as both the Network Explorer and the reference implementation for enterprise DApps built on the oracle.

## Pages

| Route | Purpose |
|-------|---------|
| `/explorer` | Real-time network dashboard: live task feed, node roster, escrow balance, protocol metrics |
| `/residao` | ResiDAO demo — submit construction estimates for AI-powered anti-corruption auditing |
| `/insurai` | InsurAI demo — parametric crop insurance with satellite/weather data analysis |
| `/dashboard` | Developer tools — API key management, escrow deposits, node orchestration, model configuration |
| `/docs` | In-app protocol documentation and quickstart guides |

## Development

```bash
cp .env.example .env   # Set RPC_URL, PINATA_JWT, GEMINI_API_KEY
pnpm dev               # http://localhost:3000
```

## Tech Stack

- Next.js 14 (App Router)
- TailwindCSS
- `@solana/wallet-adapter` for wallet connectivity
- `@solarium-labs/sdk` for all blockchain interactions
- `next-intl` for i18n (EN/RU)
- React Flow for visual pipeline diagrams
- Leaflet for geospatial map components
