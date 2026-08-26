import { useMemo } from "react";
import {
  canadaProvinces,
  createCanadaProjection,
  createCanadaPath,
  projectPoint,
} from "@/lib/canadaProjection";

/**
 * Small read-only map used in the approval flow so an admin can see where a
 * clinic will land before publishing it. Already-published clinics render
 * muted; the candidate renders highlighted with a halo.
 */

export interface PreviewPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface MapPreviewProps {
  existing: PreviewPin[];
  candidate?: PreviewPin | null;
  width?: number;
  height?: number;
}

export default function MapPreview({
  existing,
  candidate,
  width = 720,
  height = 560,
}: MapPreviewProps) {
  const projection = useMemo(
    () => createCanadaProjection(width, height, 12),
    [width, height],
  );
  const path = useMemo(() => createCanadaPath(projection), [projection]);

  const existingPoints = useMemo(
    () =>
      existing
        .map((p) => ({ pin: p, xy: projectPoint(projection, p.lat, p.lng) }))
        .filter((p): p is { pin: PreviewPin; xy: { x: number; y: number } } => !!p.xy),
    [existing, projection],
  );

  const candidatePoint = useMemo(
    () => (candidate ? projectPoint(projection, candidate.lat, candidate.lng) : null),
    [candidate, projection],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto rounded-xl bg-[#0b131f]"
      role="img"
      aria-label="Preview of the services map"
      data-testid="svg-map-preview"
    >
      <defs>
        <filter id="preview-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00DD89" floodOpacity="0.9" />
        </filter>
      </defs>

      {canadaProvinces.features.map((f) => {
        const d = path(f as never);
        return d ? (
          <path
            key={f.properties.code}
            d={d}
            fill="#1c3049"
            stroke="#2b4762"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        ) : null;
      })}

      {/* Already published — muted context */}
      {existingPoints.map(({ pin, xy }) => (
        <circle
          key={pin.id}
          cx={xy.x}
          cy={xy.y}
          r={6}
          fill="#38566f"
          stroke="#5b7b95"
          strokeWidth={1.5}
          data-testid="preview-pin-existing"
        >
          <title>{pin.name}</title>
        </circle>
      ))}

      {/* The candidate being reviewed */}
      {candidatePoint && candidate && (
        <g data-testid="preview-pin-candidate">
          <circle
            cx={candidatePoint.x}
            cy={candidatePoint.y}
            r={18}
            fill="#00DD89"
            opacity={0.18}
          >
            <animate
              attributeName="r"
              values="14;24;14"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={candidatePoint.x}
            cy={candidatePoint.y}
            r={9}
            fill="#00DD89"
            stroke="#ffffff"
            strokeWidth={2.5}
            filter="url(#preview-glow)"
          >
            <title>{candidate.name}</title>
          </circle>
        </g>
      )}
    </svg>
  );
}
