import { useEffect, useState } from "react";
import type { HealthcareCenter } from "@/data/healthcareCenters";

/**
 * Published services-map clinics.
 *
 * Reads GET /api/map/clinics — the public read model, which only contains
 * records an admin has explicitly approved in the console. Coordinates come
 * from the server, already resolved at approval time, so nothing here guesses
 * a location.
 *
 * Results are shaped into HealthcareCenter so the existing map and modal
 * components consume them unchanged.
 */

interface ApiClinic {
  id: number;
  name: string;
  city: string | null;
  province: string | null;
  street: string | null;
  postalCode: string | null;
  phone: string | null;
  contactName: string | null;
  designation: string | null;
  subspecialty: string | null;
  amyloidosisType: string | null;
  lat: number | null;
  lng: number | null;
}

export interface MapClinicsState {
  clinics: HealthcareCenter[];
  loading: boolean;
  error: string | null;
}

/**
 * A factual one-liner assembled from the record, e.g.
 *   "Amyloidosis care led by Haytham Sharar, Nurse practitioner (Heart failure)."
 * Returns "" when there is nothing to say, rather than padding with filler.
 */
function buildDescription(c: ApiClinic): string {
  const who = [c.contactName, c.designation].filter(Boolean).join(", ");
  if (!who) return "";
  const focus = c.subspecialty ? ` Sub-specialty: ${c.subspecialty}.` : "";
  const type = c.amyloidosisType
    ? ` Cares for patients with ${c.amyloidosisType} amyloidosis.`
    : "";
  return `Contact at this centre: ${who}.${focus}${type}`.trim();
}

function toHealthcareCenter(c: ApiClinic): HealthcareCenter {
  const address = [c.street, c.city, c.province, c.postalCode]
    .filter(Boolean)
    .join(", ");

  return {
    id: `clinic-${c.id}`,
    name: c.name,
    city: c.city ?? "",
    province: c.province ?? "",
    // Legacy field on the type; the map uses lat/lng below.
    coordinates: { x: 0, y: 0 },
    lat: c.lat ?? undefined,
    lng: c.lng ?? undefined,
    type: "hospital",
    // Derived from the member's own answers on the registration form. Nothing
    // here is invented — an absent field simply produces no entry, and the UI
    // hides sections that end up empty.
    specialties: [c.amyloidosisType, c.subspecialty]
      .filter((v): v is string => !!v && v.trim().length > 0)
      .map((v) => v.trim()),
    contact: {
      phone: c.phone ?? "",
      email: "",
      address,
    },
    services: [],
    description: buildDescription(c),
  };
}

export function useMapClinics(): MapClinicsState {
  const [state, setState] = useState<MapClinicsState>({
    clinics: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/map/clinics");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (cancelled) return;

        const clinics: HealthcareCenter[] = (body.clinics ?? [])
          // A clinic without coordinates cannot be drawn; drop it rather than
          // rendering a pin at an arbitrary position.
          .filter((c: ApiClinic) => c.lat != null && c.lng != null)
          .map(toHealthcareCenter);

        setState({ clinics, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({
          clinics: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load clinics",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
