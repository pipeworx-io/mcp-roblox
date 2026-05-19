interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Roblox MCP.
 */


const UA = 'pipeworx-mcp-roblox/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'user_by_username', description: 'Resolve username to user id.', inputSchema: { type: 'object', properties: { username: { type: 'string' } }, required: ['username'] } },
  { name: 'user', description: 'User profile.', inputSchema: { type: 'object', properties: { user_id: { type: 'number' } }, required: ['user_id'] } },
  { name: 'user_friends', description: 'Friends list.', inputSchema: { type: 'object', properties: { user_id: { type: 'number' } }, required: ['user_id'] } },
  { name: 'user_followers_count', description: 'Follower count.', inputSchema: { type: 'object', properties: { user_id: { type: 'number' } }, required: ['user_id'] } },
  { name: 'user_followings_count', description: 'Following count.', inputSchema: { type: 'object', properties: { user_id: { type: 'number' } }, required: ['user_id'] } },
  {
    name: 'user_badges',
    description: 'Badges.',
    inputSchema: { type: 'object', properties: { user_id: { type: 'number' }, limit: { type: 'number' }, sortOrder: { type: 'string' } }, required: ['user_id'] },
  },
  {
    name: 'user_games',
    description: 'Created games.',
    inputSchema: { type: 'object', properties: { user_id: { type: 'number' }, limit: { type: 'number' }, sortOrder: { type: 'string' } }, required: ['user_id'] },
  },
  {
    name: 'user_presence',
    description: 'Presence for up to 100 user ids.',
    inputSchema: { type: 'object', properties: { user_ids: { type: 'array', items: { type: 'number' } } }, required: ['user_ids'] },
  },
  { name: 'group', description: 'Group detail.', inputSchema: { type: 'object', properties: { group_id: { type: 'number' } }, required: ['group_id'] } },
  { name: 'game', description: 'Game (universe) detail.', inputSchema: { type: 'object', properties: { universe_id: { type: 'number' } }, required: ['universe_id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const reqNum = (k: string, ex: string) => {
    const v = args[k];
    if (v == null || typeof v !== 'number') throw new Error(`Required argument "${k}" is missing. Pass a number like ${ex}.`);
    return v;
  };
  const json = async (url: string, init?: RequestInit) => {
    const res = await fetch(url, { ...init, headers: { Accept: 'application/json', 'User-Agent': UA, ...(init?.headers ?? {}) } });
    if (res.status === 404) throw new Error('Roblox: 404 — not found.');
    if (!res.ok) throw new Error(`Roblox: ${res.status}`);
    return res.json();
  };
  switch (name) {
    case 'user_by_username': {
      const body = JSON.stringify({ usernames: [reqStr(args, 'username', '"builderman"')], excludeBannedUsers: true });
      return json('https://users.roblox.com/v1/usernames/users', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
    }
    case 'user':
      return json(`https://users.roblox.com/v1/users/${reqNum('user_id', '156')}`);
    case 'user_friends':
      return json(`https://friends.roblox.com/v1/users/${reqNum('user_id', '156')}/friends`);
    case 'user_followers_count':
      return json(`https://friends.roblox.com/v1/users/${reqNum('user_id', '156')}/followers/count`);
    case 'user_followings_count':
      return json(`https://friends.roblox.com/v1/users/${reqNum('user_id', '156')}/followings/count`);
    case 'user_badges': {
      const p = new URLSearchParams();
      if (args.limit != null) p.set('limit', String(args.limit));
      if (args.sortOrder) p.set('sortOrder', String(args.sortOrder));
      return json(`https://badges.roblox.com/v1/users/${reqNum('user_id', '156')}/badges?${p}`);
    }
    case 'user_games': {
      const p = new URLSearchParams();
      if (args.limit != null) p.set('limit', String(args.limit));
      if (args.sortOrder) p.set('sortOrder', String(args.sortOrder));
      return json(`https://games.roblox.com/v2/users/${reqNum('user_id', '156')}/games?${p}`);
    }
    case 'user_presence': {
      const ids = args.user_ids;
      if (!Array.isArray(ids)) throw new Error('Required argument "user_ids" must be an array of numbers.');
      return json('https://presence.roblox.com/v1/presence/users', { method: 'POST', body: JSON.stringify({ userIds: ids }), headers: { 'Content-Type': 'application/json' } });
    }
    case 'group':
      return json(`https://groups.roblox.com/v1/groups/${reqNum('group_id', '7'  )}`);
    case 'game':
      return json(`https://games.roblox.com/v1/games?universeIds=${reqNum('universe_id', '1685831367')}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
