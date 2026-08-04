# @pipeworx/roblox

Roblox MCP — keyless public-profile lookups via roblox.com's subdomain APIs.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Roblox data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
