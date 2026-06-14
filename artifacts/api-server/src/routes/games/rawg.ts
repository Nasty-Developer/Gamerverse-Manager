const RAWG_BASE = "https://api.rawg.io/api";

function getRawgKey(): string {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY is not set");
  return key;
}

export async function rawgFetch(path: string, params: Record<string, string | number | undefined> = {}): Promise<unknown> {
  const url = new URL(`${RAWG_BASE}${path}`);
  url.searchParams.set("key", getRawgKey());
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`RAWG API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
