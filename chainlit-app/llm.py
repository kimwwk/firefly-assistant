"""Claude LLM interaction logic."""

import anthropic
import chainlit as cl
from config import get_system_prompt, CLAUDE_MODEL, CLAUDE_MAX_TOKENS


# Initialize Anthropic client
client = anthropic.AsyncAnthropic()


def flatten(xss):
    """Flatten a list of lists into a single list."""
    return [x for xs in xss for x in xs]


def get_tools_from_session():
    """Get flattened tools from all MCP connections."""
    mcp_tools = cl.user_session.get("mcp_tools", {})
    return flatten([tools for _, tools in mcp_tools.items()])


async def call_claude(chat_messages):
    """Call Claude with streaming and tools."""
    msg = cl.Message(content="")
    tools = get_tools_from_session()

    if not tools:
        # No tools available, just chat
        async with client.messages.stream(
            system=get_system_prompt(),
            max_tokens=CLAUDE_MAX_TOKENS,
            messages=chat_messages,
            model=CLAUDE_MODEL,
        ) as stream:
            async for text in stream.text_stream:
                await msg.stream_token(text)
        await msg.send()
        return await stream.get_final_message()

    # Stream with tools
    async with client.messages.stream(
        system=get_system_prompt(),
        max_tokens=CLAUDE_MAX_TOKENS,
        messages=chat_messages,
        tools=tools,
        model=CLAUDE_MODEL,
    ) as stream:
        async for text in stream.text_stream:
            await msg.stream_token(text)

    await msg.send()
    return await stream.get_final_message()
