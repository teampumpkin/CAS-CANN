/**
 * City coordinate lookup.
 *
 * At national scale one rendered pixel is roughly 5 km, so a city centroid is
 * already finer than the map can draw — street-level geocoding would be wasted
 * precision here. This table covers the cities currently on the map; the real
 * services-map data will carry its own latitude/longitude from geocoding at
 * approval time and will not depend on this file.
 */

export interface CityCoordinate {
  lat: number;
  lng: number;
}

/** Keyed by "city|province-code", both lowercased. */
const CITY_COORDINATES: Record<string, CityCoordinate> = {
  "vancouver|bc": { lat: 49.2827, lng: -123.1207 },
  "new westminster|bc": { lat: 49.2057, lng: -122.911 },
  "surrey|bc": { lat: 49.1913, lng: -122.849 },
  "burnaby|bc": { lat: 49.2488, lng: -122.9805 },
  "abbotsford|bc": { lat: 49.0504, lng: -122.3045 },
  "victoria|bc": { lat: 48.4284, lng: -123.3656 },
  "kelowna|bc": { lat: 49.888, lng: -119.496 },
  "calgary|ab": { lat: 51.0447, lng: -114.0719 },
  "edmonton|ab": { lat: 53.5461, lng: -113.4938 },
  "saskatoon|sk": { lat: 52.1332, lng: -106.67 },
  "regina|sk": { lat: 50.4452, lng: -104.6189 },
  "winnipeg|mb": { lat: 49.8951, lng: -97.1384 },
  "toronto|on": { lat: 43.6532, lng: -79.3832 },
  "ottawa|on": { lat: 45.4215, lng: -75.6972 },
  "hamilton|on": { lat: 43.2557, lng: -79.8711 },
  "simcoe|on": { lat: 42.8376, lng: -80.3021 },
  "mississauga|on": { lat: 43.589, lng: -79.6441 },
  "brampton|on": { lat: 43.6832, lng: -79.7629 },
  "oshawa|on": { lat: 43.8971, lng: -78.8658 },
  "windsor|on": { lat: 42.3149, lng: -83.0364 },
  "sudbury|on": { lat: 46.4917, lng: -80.993 },
  "thunder bay|on": { lat: 48.3809, lng: -89.2477 },
  "barrie|on": { lat: 44.3894, lng: -79.6903 },
  "newmarket|on": { lat: 44.0592, lng: -79.4613 },
  "st. catharines|on": { lat: 43.1594, lng: -79.2469 },
  "kitchener|on": { lat: 43.4516, lng: -80.4925 },
  "london|on": { lat: 42.9849, lng: -81.2453 },
  "kingston|on": { lat: 44.2312, lng: -76.486 },
  "montreal|qc": { lat: 45.5019, lng: -73.5674 },
  "quebec city|qc": { lat: 46.8139, lng: -71.208 },
  "quebec|qc": { lat: 46.8139, lng: -71.208 },
  "laval|qc": { lat: 45.6066, lng: -73.7124 },
  "gatineau|qc": { lat: 45.4765, lng: -75.7013 },
  "trois-rivieres|qc": { lat: 46.3432, lng: -72.5432 },
  "sherbrooke|qc": { lat: 45.4042, lng: -71.8929 },
  "saint john|nb": { lat: 45.2733, lng: -66.0633 },
  "fredericton|nb": { lat: 45.9636, lng: -66.6431 },
  "moncton|nb": { lat: 46.0878, lng: -64.7782 },
  "halifax|ns": { lat: 44.6488, lng: -63.5752 },
  "sydney|ns": { lat: 46.1368, lng: -60.1942 },
  "charlottetown|pe": { lat: 46.2382, lng: -63.1311 },
  "st. john's|nl": { lat: 47.5615, lng: -52.7126 },
  "st johns|nl": { lat: 47.5615, lng: -52.7126 },
  "whitehorse|yt": { lat: 60.7212, lng: -135.0568 },
  "yellowknife|nt": { lat: 62.454, lng: -114.3718 },
  "iqaluit|nu": { lat: 63.7467, lng: -68.517 },
};

/** Fallback so a province with an unrecognised city still renders somewhere sane. */
const PROVINCE_FALLBACK: Record<string, CityCoordinate> = {
  bc: { lat: 53.7267, lng: -127.6476 },
  ab: { lat: 53.9333, lng: -116.5765 },
  sk: { lat: 52.9399, lng: -106.4509 },
  mb: { lat: 53.7609, lng: -98.8139 },
  on: { lat: 49.2538, lng: -84.3232 },
  qc: { lat: 52.9399, lng: -71.5491 },
  nb: { lat: 46.5653, lng: -66.4619 },
  ns: { lat: 44.682, lng: -63.7443 },
  pe: { lat: 46.5107, lng: -63.4168 },
  nl: { lat: 53.1355, lng: -57.6604 },
  yt: { lat: 63.2823, lng: -135.0 },
  nt: { lat: 64.8255, lng: -124.8457 },
  nu: { lat: 66.2998, lng: -83.1076 },
};

const PROVINCE_NAME_TO_CODE: Record<string, string> = {
  ontario: "on",
  quebec: "qc",
  québec: "qc",
  "british columbia": "bc",
  alberta: "ab",
  manitoba: "mb",
  saskatchewan: "sk",
  "nova scotia": "ns",
  "new brunswick": "nb",
  "newfoundland and labrador": "nl",
  "prince edward island": "pe",
  "northwest territories": "nt",
  nunavut: "nu",
  yukon: "yt",
};

/** Accepts either a two-letter code or a full province name. */
export function normalizeProvinceCode(province: string): string {
  const raw = (province ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (raw.length === 2) return raw;
  return PROVINCE_NAME_TO_CODE[raw] ?? raw;
}

/**
 * Resolves a city to coordinates, falling back to the province centre.
 * Returns null when the province is unrecognised, so callers can surface
 * "location unknown" rather than dropping a pin in the ocean.
 */
export function lookupCityCoordinates(
  city: string | null | undefined,
  province: string | null | undefined,
): CityCoordinate | null {
  const code = normalizeProvinceCode(province ?? "");
  // Live CRM data contains accented names ("Québec", "Montréal"), so fold
  // diacritics before lookup rather than duplicating every entry.
  const cityKey = (city ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\/g, "");

  const exact = CITY_COORDINATES[`${cityKey}|${code}`];
  if (exact) return exact;

  return PROVINCE_FALLBACK[code] ?? null;
}
