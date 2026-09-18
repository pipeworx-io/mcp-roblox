# @pipeworx/roblox

Roblox MCP — keyless public-profile lookups via roblox.com's subdomain APIs.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `user_by_username(username)` — resolve username → user id
- `user(user_id)` — user profile detail
- `user_friends(user_id)` — friends list
- `user_followers_count(user_id)` — follower count
- `user_followings_count(user_id)` — following count
- `user_badges(user_id, limit?, sortOrder?)` — badges
- `user_games(user_id, limit?, sortOrder?)` — created games
- `user_presence(user_ids)` — presence/status for up to 100 user ids (POST)
- `group(group_id)` — group detail
- `game(universe_id)` — game (universe) detail

## Data source

`https://users.roblox.com`, `https://friends.roblox.com`, `https://badges.roblox.com`, `https://games.roblox.com`, `https://groups.roblox.com`, `https://presence.roblox.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "roblox": {
      "url": "https://gateway.pipeworx.io/roblox/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/roblox/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Roblox data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/user_by_username \
  -H 'Content-Type: application/json' \
  -d '{"username":"builderman"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/user_by_username`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
