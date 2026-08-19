import { apiClient } from "./client";
import type { Package, PackageDetail, PackageRoom } from "./types";

export async function getPackages(): Promise<Package[]> {
  const { data } = await apiClient.get<Package[]>("/packages/");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in (data as Record<string, unknown>) && Array.isArray((data as { results: unknown }).results)) {
    return (data as { results: Package[] }).results;
  }
  return [];
}

export async function getPackage(id: number): Promise<PackageDetail> {
  const { data } = await apiClient.get<PackageDetail>(`/packages/${id}/`);
  return data;
}

export async function getPackageRooms(id: number): Promise<PackageRoom[]> {
  const { data } = await apiClient.get<PackageRoom[]>(`/packages/${id}/rooms/`);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in (data as Record<string, unknown>) && Array.isArray((data as { results: unknown }).results)) {
    return (data as { results: PackageRoom[] }).results;
  }
  return [];
}
