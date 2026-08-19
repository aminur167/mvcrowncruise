import { apiClient } from "./client";
import type { CabinDetail, CabinSummary } from "./types";

export async function getCabins(): Promise<CabinSummary[]> {
  const { data } = await apiClient.get<CabinSummary[]>("/cabins/");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in (data as Record<string, unknown>) && Array.isArray((data as { results: unknown }).results)) {
    return (data as { results: CabinSummary[] }).results;
  }
  return [];
}

export async function getCabin(slug: string): Promise<CabinDetail> {
  const { data } = await apiClient.get<CabinDetail>(`/cabins/${slug}/`);
  return data;
}
