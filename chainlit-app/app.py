"""
Firefly Assistant - Main Application Entry Point

A personal finance assistant powered by Claude and Firefly III.
"""

import chainlit as cl

# Import configuration
from config import WELCOME_MESSAGE

# Import handlers (decorators register automatically)
import mcp_handlers  # noqa: F401

# Import modules
from sidebar import init_sidebar, show_processing
from tools import request_tool_approval, call_tool
from llm import call_claude


@cl.on_chat_start
async def on_chat_start():
    """Initialize chat session."""
    cl.user_session.set("chat_messages", [])
    cl.user_session.set("mcp_tools", {})

    await init_sidebar()

    await cl.Message(content=WELCOME_MESSAGE).send()


@cl.on_message
async def on_message(msg: cl.Message):
    """Handle incoming messages."""
    await show_processing()

    chat_messages = cl.user_session.get("chat_messages", [])
    chat_messages.append({"role": "user", "content": msg.content})

    response = await call_claude(chat_messages)

    # Handle tool calls in a loop
    while response.stop_reason == "tool_use":
        tool_uses = [block for block in response.content if block.type == "tool_use"]

        tool_results = []
        for tool_use in tool_uses:
            approved = await request_tool_approval(tool_use.name, tool_use.input)
            tool_result = await call_tool(tool_use, approved=approved)

            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": str(tool_result),
                "is_error": not approved,
            })

        # Add assistant response and tool results to messages
        chat_messages.extend([
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": tool_results},
        ])

        response = await call_claude(chat_messages)

    # Extract final text response
    final_response = next(
        (block.text for block in response.content if hasattr(block, "text")),
        None,
    )

    if final_response:
        chat_messages.append({"role": "assistant", "content": final_response})

    cl.user_session.set("chat_messages", chat_messages)
