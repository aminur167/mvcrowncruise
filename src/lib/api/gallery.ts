import { apiClient } from "./client";
import type { GalleryImage } from "./types";

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data } = await apiClient.get<GalleryImage[]>("/gallery/");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in (data as Record<string, unknown>) && Array.isArray((data as { results: unknown }).results)) {
    return (data as { results: GalleryImage[] }).results;
  }
  return [];
}
