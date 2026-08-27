import { callTool } from "./client.mjs";

const name = process.argv[2];
if (!name) {
  console.error("usage: node dsl/run.mjs <stepName>");
  process.exit(1);
}
const mod = await import(`./${name}.js`);
const res = await callTool(mod.default.tool, mod.default.args);
const content = res.result?.content || [];
for (const c of content) {
  if (c.type === "text") {
    const t = c.text;
    console.log(t.length > 8000 ? t.slice(0, 8000) + "\n...[truncated]" : t);
  }
}
if (res.error) console.error("ERROR:", JSON.stringify(res.error));
