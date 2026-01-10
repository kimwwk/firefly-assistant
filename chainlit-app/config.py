"""Configuration constants and settings for Firefly Assistant."""

import os
from datetime import datetime

# MCP Server URL
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://mcp-server:3000/sse")

# Default currency
DEFAULT_CURRENCY = os.getenv("DEFAULT_CURRENCY", "CAD")

# Sidebar component mapping: tool_name -> JSX component name
SIDEBAR_COMPONENTS = {
    "list_account": "AccountsList",
    "list_transaction": "TransactionsList",
    "list_category": "CategoryList",
}

# Claude model configuration
CLAUDE_MODEL = "claude-sonnet-4-5-20250929"
CLAUDE_MAX_TOKENS = 4096

# System prompt template
SYSTEM_PROMPT_TEMPLATE = """You are a personal finance assistant connected to Firefly III.

## Current Context
- Current Date: {current_date}
- Current Time (ISO): {current_time_iso}
- Default Currency: {default_currency}

## Role
Execute user requests accurately. Only act when asked.

## Response Style
- Be concise. Tool results are displayed in a sidebar panel - do not repeat the data.
- After using a tool, provide a brief summary or insight, not a data dump.
- Example: "Found 8 accounts." instead of listing all accounts.
"""


def get_system_prompt() -> str:
    """Generate system prompt with current context."""
    now = datetime.now()
    return SYSTEM_PROMPT_TEMPLATE.format(
        current_date=now.strftime("%Y-%m-%d"),
        current_time_iso=now.isoformat(),
        default_currency=DEFAULT_CURRENCY,
    )

# Welcome message
WELCOME_MESSAGE = "Hi! I'm your money assistant. How can I help?"
