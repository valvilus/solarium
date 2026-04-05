# agent/

Off-chain node daemon for the Solarium Protocol. Operators run this as a Dockerized service to participate in the network as a Worker or Validator and earn rewards.

## How It Works

**Worker mode** (`worker.ts`):  
Polls the blockchain for tasks with status `Open`. Claims the task (locking stake), downloads the TaskManifest from IPFS, runs AI inference against it using a configurable model (Gemini, OpenAI, or mock), uploads a structured JSON report to storage, then submits a cryptographic commitment `hash(verdict + salt)` on-chain. After the commit window closes, reveals the plain verdict and salt for on-chain verification.

**Validator mode** (`validator.ts`):  
Polls for tasks with status `Committed`. Downloads the Worker's JSON report from IPFS, verifies its hash against the on-chain commitment, then evaluates the Worker's reasoning using the LLM-as-a-Judge paradigm at `temperature=0`. Submits an independent vote (Agree / Disagree / Invalid). If the Worker attempted prompt injection or manipulation, the Validator votes `Invalid`.

## Configuration

Copy `.env.example` and set the required values:

| Variable | Description |
|----------|-------------|
| `NODE_ROLE` | `worker` or `validator` |
| `NODE_TIER` | Node tier level (1-3) |
| `AI_MODEL` | `gemini` or `mock` |
| `GEMINI_API_KEY` | API key for inference |
| `PINATA_JWT` | IPFS upload/download token |
| `RPC_URL` | Solana RPC endpoint |

## Running

```bash
docker build -t solarium-agent:latest -f Dockerfile.agent .
docker run -d --env-file .env solarium-agent:latest
```
