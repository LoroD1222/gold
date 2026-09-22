const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "og32jxcd";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2026-09-22";

export async function sanityFetch<T>(query: string, params: Record<string, string | number | boolean> = {}, revalidate = 60): Promise<T> {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  });

  const response = await fetch(url, { next: { revalidate } });
  if (!response.ok) throw new Error(`Sanity query failed with ${response.status}`);

  const payload = (await response.json()) as { result: T };
  return payload.result;
}
