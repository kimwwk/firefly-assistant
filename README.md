# Firefly Assistant

A personal finance assistant powered by Claude and [Firefly III](https://www.firefly-iii.org/), built with [Chainlit](https://chainlit.io/).

Chat with your own finances: ask about balances, search transactions, and create or edit entries in Firefly III — with a human-approval step before anything is written. It's **self-hosted** and runs against *your* Firefly III instance, so there is no public demo; follow the Quick Start below to run it locally.

**Prerequisites:** Docker + Docker Compose, a running Firefly III instance (with a Personal Access Token), and an Anthropic API key.

## Features

- Chat interface for managing your Firefly III finances
- Claude AI with tool calling for intelligent assistance
- Human approval required before executing actions
- MCP (Model Context Protocol) integration

## Architecture

```
┌─────────────────────────────────────┐
│           Docker Compose            │
│  ┌───────────┐     ┌─────────────┐  │
│  │ Chainlit  │────►│ MCP Server  │  │
│  │  :8000    │     │   :3000     │  │
│  └─────┬─────┘     └──────┬──────┘  │
└────────┼──────────────────┼─────────┘
         │                  │
         ▼                  ▼
   Claude API         Firefly III
   (Anthropic)        (Your server)
```

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `FIREFLY_III_PAT`: Your Firefly III Personal Access Token
   - `FIREFLY_III_BASE_URL`: Your Firefly III URL

3. **Start the services:**
   ```bash
   docker compose up -d
   ```

4. **Access the app:**
   Open http://localhost:8000 in your browser

5. **Connect to MCP:**
   - Click the MCP button in the sidebar
   - Add connection with type: SSE
   - URL: `http://mcp-server:3000/sse`

## Configuration

### Tool Presets

Set `FIREFLY_III_PRESET` in `.env` to control available tools:

| Preset | Description |
|--------|-------------|
| `basic` | Accounts, transactions, categories, tags, search, summary |
| `budget` | Budget-focused operations |
| `reporting` | Analytics and insights |
| `full` | All available tools |

### Chainlit Config

Edit `chainlit-app/.chainlit/config.toml` for UI customization.

## Development

Run the two services locally without Docker.

**MCP server** — uses the published [`@firefly-iii-mcp/server`](https://www.npmjs.com/package/@firefly-iii-mcp/server) npm package (no local build needed):

```bash
npx @firefly-iii-mcp/server \
  --pat "$FIREFLY_III_PAT" \
  --baseUrl "$FIREFLY_III_BASE_URL" \
  --preset basic \
  --port 3000
```

**Chainlit app:**

```bash
cd chainlit-app
pip install -r requirements.txt
chainlit run app.py
```

For a deeper look at how the pieces fit together, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## License

MIT
