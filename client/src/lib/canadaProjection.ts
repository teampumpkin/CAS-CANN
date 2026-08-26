/**
 * Canada map projection helpers.
 *
 * Replaces the hand-tuned percentage coordinates the old map used with a real
 * cartographic projection, so a clinic's latitude/longitude places its pin
 * correctly with no per-record calibration.
 *
 * Lambert Conformal Conic with standard parallels 49°N / 77°N and central
 * meridian 95°W — Canada Atlas Lambert, the conventional projection for
 * national-scale Canadian maps. Measured against the previous SVG's geometry,
 * this is the projection it was already drawn in, so the outline keeps the same
 * familiar shape and proportions.
 */

import { geoConicConformal, geoPath, type GeoProjection, type GeoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import rawProvinces from "@/data/geo/canada-provinces.json";

export interface ProvinceProperties {
  /** Two-letter postal code: ON, QC, BC … */
  code: string;
  name: string;
}

export const canadaProvinces =
  rawProvinces as unknown as FeatureCollection<Geometry, ProvinceProperties>;

/** Standard parallels and central meridian for Canada Atlas Lambert. */
export const LCC_PARALLELS: [number, number] = [49, 77];
export const LCC_CENTRAL_MERIDIAN = -95;

/**
 * Builds a projection fitted to the given pixel box.
 *
 * `fitSize` scales and centres the geometry, so the caller never hardcodes a
 * scale — the map fills whatever space the layout gives it.
 */
export function createCanadaProjection(
  width: number,
  height: number,
  padding = 8,
): GeoProjection {
  return geoConicConformal()
    .parallels(LCC_PARALLELS)
    .rotate([-LCC_CENTRAL_MERIDIAN, 0])
    .fitExtent(
      [
        [padding, padding],
        [Math.max(padding + 1, width - padding), Math.max(padding + 1, height - padding)],
      ],
      canadaProvinces,
    );
}

export function createCanadaPath(projection: GeoProjection): GeoPath {
  return geoPath(projection);
}

/**
 * Projects a coordinate to pixel space.
 *
 * Returns null when the point falls outside the projection's valid domain —
 * callers must handle that rather than rendering a pin at NaN.
 */
export function projectPoint(
  projection: GeoProjection,
  lat: number,
  lng: number,
): { x: number; y: number } | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const result = projection([lng, lat]); // d3 takes [longitude, latitude]
  if (!result) return null;
  const [x, y] = result;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

/** Rough centre of each province, for province-level labels or fallbacks. */
export function provinceCentroid(
  projection: GeoProjection,
  code: string,
): { x: number; y: number } | null {
  const feature = canadaProvinces.features.find((f) => f.properties.code === code);
  if (!feature) return null;
  const [x, y] = geoPath(projection).centroid(feature as never);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}
