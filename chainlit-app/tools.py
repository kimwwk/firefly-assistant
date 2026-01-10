"""Tool approval and execution logic."""

import json
import chainlit as cl
from sidebar import display_in_sidebar


def format_input_display(tool_input: dict) -> str:
    """Format tool input for clean display."""
    if not tool_input:
        return "(no parameters)"

    # For requestBody, show just the body content
    if "requestBody" in tool_input and len(tool_input) == 1:
        return json.dumps(tool_input["requestBody"], indent=2)

    return json.dumps(tool_input, indent=2)


def get_result_summary(result_text: str) -> str:
    """Get a brief summary for the step name."""
    try:
        data = json.loads(result_text)
        if isinstance(data, list):
            return f"{len(data)} items"
        elif isinstance(data, dict) and "data" in data:
            items = data["data"]
            if isinstance(items, list):
                return f"{len(items)} items"
            elif isinstance(items, dict):
                attrs = items.get("attributes", {})
                name = attrs.get("name") or attrs.get("description") or ""
                if name:
                    return name
        return ""
    except json.JSONDecodeError:
        return ""


async def request_tool_approval(tool_name: str, tool_input: dict) -> bool:
    """Ask user for approval before executing a tool."""
    input_display = format_input_display(tool_input)

    res = await cl.AskActionMessage(
        content=f"**{tool_name}**\n```json\n{input_display}\n```",
        actions=[
            cl.Action(name="approve", payload={"value": "approve"}, label="Approve"),
            cl.Action(name="reject", payload={"value": "reject"}, label="Reject"),
        ],
        timeout=120,
    ).send()

    if res and res.get("payload", {}).get("value") == "approve":
        return True
    return False


@cl.step(type="tool")
async def call_tool(tool_use, approved: bool = True):
    """Execute a tool via MCP."""
    tool_name = tool_use.name
    tool_input = tool_use.input

    current_step = cl.context.current_step
    current_step.name = tool_name
    current_step.input = format_input_display(tool_input)
    current_step.show_input = "json"
    current_step.language = "json"

    if not approved:
        current_step.output = "User rejected this action."
        return current_step.output

    # Find which MCP connection has this tool
    mcp_tools = cl.user_session.get("mcp_tools", {})
    mcp_name = None

    for connection_name, tools in mcp_tools.items():
        if any(tool.get("name") == tool_name for tool in tools):
            mcp_name = connection_name
            break

    if not mcp_name:
        current_step.output = json.dumps({"error": f"Tool {tool_name} not found in any MCP connection"})
        return current_step.output

    mcp_session, _ = cl.context.session.mcp_sessions.get(mcp_name)

    if not mcp_session:
        current_step.output = json.dumps({"error": f"MCP session {mcp_name} not found"})
        return current_step.output

    try:
        result = await mcp_session.call_tool(tool_name, tool_input)
        # Extract text content from result
        if hasattr(result, 'content') and result.content:
            for content_item in result.content:
                if hasattr(content_item, 'text'):
                    result_text = content_item.text
                    # Format JSON for display, rich component in sidebar
                    try:
                        formatted = json.dumps(json.loads(result_text), indent=2)
                        current_step.output = formatted
                    except json.JSONDecodeError:
                        current_step.output = result_text

                    # Add summary to step name
                    summary = get_result_summary(result_text)
                    if summary:
                        current_step.name = f"{tool_name} → {summary}"

                    await display_in_sidebar(tool_name, result_text)
                    return result_text  # Return full result for Claude
        current_step.output = "No content returned"
    except Exception as e:
        current_step.output = f"Error: {str(e)}"
        return json.dumps({"error": str(e)})

    return current_step.output
