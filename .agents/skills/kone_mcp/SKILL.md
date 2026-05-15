---
name: kone_mcp
description: Interact with the Kone MCP API using mcp2cli. Currently fails with "Incorrect app URL", indicating a missing path or token.
---

# kone_mcp

Turn the Kone MCP API into a CLI tool.

**Note:** Connecting to `https://go.kone.vc/mcp` currently returns a 400 Bad Request: `{"error":{"code":400,"message":"Incorrect app URL"},"status":"error"}`. This suggests that the provided URL is incomplete (perhaps missing an app ID, project ID, or authentication token in the URL path/query). Once the correct URL is obtained, you can use the commands below.

## Discovery

```bash
uvx mcp2cli --mcp https://go.kone.vc/mcp/APP_ID_OR_CORRECT_PATH --list
```

## Usage

After finding the available commands via `--list`:

```bash
uvx mcp2cli --mcp https://go.kone.vc/mcp/APP_ID_OR_CORRECT_PATH <command> --help
```

To execute a command with JSON output:

```bash
uvx mcp2cli --mcp https://go.kone.vc/mcp/APP_ID_OR_CORRECT_PATH <command> --param1 "value" --pretty
```
