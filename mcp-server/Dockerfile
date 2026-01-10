FROM node:20-slim

WORKDIR /app

# Install the MCP server package from npm
RUN npm install -g @firefly-iii-mcp/server

# Expose the server port
EXPOSE 3000

# Run the server with debug logging
CMD npx @firefly-iii-mcp/server \
    --pat "$FIREFLY_III_PAT" \
    --baseUrl "$FIREFLY_III_BASE_URL" \
    --preset "$FIREFLY_III_PRESET" \
    --logLevel debug \
    --port 3000
