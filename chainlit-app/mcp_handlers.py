"""MCP connection handlers."""

from mcp import ClientSession
import chainlit as cl


@cl.on_mcp_connect
async def on_mcp_connect(connection, session: ClientSession):
    """Called when MCP connection is established."""
    result = await session.list_tools()
    tools = [{
        "name": t.name,
        "description": t.description,
        "input_schema": t.inputSchema,
    } for t in result.tools]

    mcp_tools = cl.user_session.get("mcp_tools", {})
    mcp_tools[connection.name] = tools
    cl.user_session.set("mcp_tools", mcp_tools)

    await cl.Message(
        content=f"Connected to Firefly III. {len(tools)} tools available."
    ).send()


@cl.on_mcp_disconnect
async def on_mcp_disconnect(name: str, session: ClientSession):
    """Called when MCP connection is terminated."""
    mcp_tools = cl.user_session.get("mcp_tools", {})
    if name in mcp_tools:
        del mcp_tools[name]
    cl.user_session.set("mcp_tools", mcp_tools)
