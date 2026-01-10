"""Sidebar display logic for tool results."""

import json
import chainlit as cl
from config import SIDEBAR_COMPONENTS


async def display_in_sidebar(tool_name: str, result_text: str):
    """Display tool result in sidebar if component exists, otherwise show placeholder."""
    component = SIDEBAR_COMPONENTS.get(tool_name)

    if not component:
        await cl.ElementSidebar.set_title("Tool Results")
        await cl.ElementSidebar.set_elements([
            cl.Text(
                content=f"Tool '{tool_name}' executed. No visual component available.",
                name="placeholder"
            )
        ])
        return

    try:
        data = json.loads(result_text)
        element = cl.CustomElement(name=component, props={"data": data})
        await cl.ElementSidebar.set_title(tool_name.replace("_", " ").title())
        await cl.ElementSidebar.set_elements([element])
    except (json.JSONDecodeError, Exception):
        # Fallback: show raw text
        await cl.ElementSidebar.set_title(tool_name.replace("_", " ").title())
        await cl.ElementSidebar.set_elements([
            cl.Text(content=result_text, name="result")
        ])


async def init_sidebar():
    """Initialize sidebar with empty state."""
    await cl.ElementSidebar.set_title("Dashboard")
    await cl.ElementSidebar.set_elements([
        cl.CustomElement(name="EmptyDashboard", props={})
    ])


async def show_processing():
    """Show processing state in sidebar."""
    await cl.ElementSidebar.set_title("Dashboard")
    await cl.ElementSidebar.set_elements([
        cl.CustomElement(name="ProcessingState", props={})
    ])
