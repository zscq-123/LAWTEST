const BASE = "http://localhost:3667/mcp";
const H = { Accept: "application/json, text/event-stream", "Content-Type": "application/json" };

async function post(body, session) {
  const headers = { ...H };
  if (session) headers["mcp-session-id"] = session;
  const res = await fetch(BASE, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  const data = text
    .split("\n")
    .filter((l) => l.startsWith("data: "))
    .map((l) => JSON.parse(l.slice(6)));
  return data[0];
}

let sessionId = null;

export async function callTool(name, args) {
  if (!sessionId) {
    const res = await fetch(BASE, {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "codex-pixso-builder", version: "1.0" }
        }
      })
    });
    sessionId = res.headers.get("mcp-session-id");
    await post({ jsonrpc: "2.0", method: "notifications/initialized" }, sessionId);
  }
  const out = await post(
    { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name, arguments: args } },
    sessionId
  );
  return out;
}
