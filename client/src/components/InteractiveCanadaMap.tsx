import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Award, Hospital, Stethoscope, X } from "lucide-react";

import { HealthcareCenter } from "@/data/healthcareCenters";
import { lookupCityCoordinates, normalizeProvinceCode } from "@/data/canadianCities";
import {
  canadaProvinces,
  createCanadaProjection,
  createCanadaPath,
  projectPoint,
} from "@/lib/canadaProjection";

/**
 * Interactive map of Canada.
 *
 * Geometry is real GeoJSON drawn through a Lambert Conformal Conic projection
 * (d3-geo), so pins are positioned from latitude/longitude rather than the
 * hand-tuned percentage offsets this component used previously. Clinics that
 * land within CLUSTER_RADIUS_PX of each other are merged into one marker so
 * dense areas like the Toronto–Ottawa corridor stay readable.
 */

interface InteractiveCanadaMapProps {
  healthcareCenters: HealthcareCenter[];
  onCenterClick: (center: HealthcareCenter) => void;
}

/** The projection is fitted into this box; the SVG scales responsively. */
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 780;
const CLUSTER_RADIUS_PX = 26;

interface Cluster {
  id: string;
  x: number;
  y: number;
  centers: HealthcareCenter[];
}

/** Matches the existing legend: density drives colour. */
function clusterColor(count: number): string {
  if (count >= 10) return "#00AFE6";
  if (count >= 5) return "#00DD89";
  if (count >= 2) return "#7DD3FC";
  return "#F59E0B";
}

export default function InteractiveCanadaMap({
  healthcareCenters,
  onCenterClick,
}: InteractiveCanadaMapProps) {
  const [selectedCenter, setSelectedCenter] = useState<HealthcareCenter | null>(null);
  const [openCluster, setOpenCluster] = useState<Cluster | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);

  const projection = useMemo(
    () => createCanadaProjection(VIEW_WIDTH, VIEW_HEIGHT),
    [],
  );
  const pathGenerator = useMemo(() => createCanadaPath(projection), [projection]);

  /** Project every centre, then merge pins that would overlap. */
  const { clusters, unplaced } = useMemo(() => {
    const placed: Array<{ center: HealthcareCenter; x: number; y: number }> = [];
    const missing: HealthcareCenter[] = [];

    for (const center of healthcareCenters) {
      // Published clinics carry coordinates resolved server-side at approval
      // time. Fall back to the city lookup only for records without them.
      const coords =
        center.lat != null && center.lng != null
          ? { lat: center.lat, lng: center.lng }
          : lookupCityCoordinates(center.city, center.province);

      const point = coords ? projectPoint(projection, coords.lat, coords.lng) : null;
      if (point) placed.push({ center, x: point.x, y: point.y });
      else missing.push(center);
    }

    const built: Cluster[] = [];
    for (const item of placed) {
      const near = built.find(
        (c) => Math.hypot(c.x - item.x, c.y - item.y) <= CLUSTER_RADIUS_PX,
      );
      if (near) {
        near.centers.push(item.center);
        // Keep the marker at the centroid of everything it represents.
        near.x = (near.x * (near.centers.length - 1) + item.x) / near.centers.length;
        near.y = (near.y * (near.centers.length - 1) + item.y) / near.centers.length;
      } else {
        built.push({ id: item.center.id, x: item.x, y: item.y, centers: [item.center] });
      }
    }

    built.sort((a, b) => a.y - b.y); // northern pins paint first
    return { clusters: built, unplaced: missing };
  }, [healthcareCenters, projection]);

  const provinceCount = useMemo(
    () =>
      new Set(
        healthcareCenters
          .map((c) => normalizeProvinceCode(c.province))
          .filter(Boolean),
      ).size,
    [healthcareCenters],
  );

  const handleClusterClick = (cluster: Cluster) => {
    if (cluster.centers.length === 1) setSelectedCenter(cluster.centers[0]);
    else setOpenCluster(cluster);
  };

  return (
    <div className="relative w-full">
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00AFE6]" />
            Healthcare Network Map
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            Click a marker to view centre details
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden">
          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="w-full h-auto"
            role="img"
            aria-label="Map of Canada showing amyloidosis healthcare centres"
            data-testid="svg-canada-map"
          >
            <defs>
              <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Provinces */}
            <g>
              {canadaProvinces.features.map((feature) => {
                const d = pathGenerator(feature as never);
                if (!d) return null;
                return (
                  <path
                    key={feature.properties.code}
                    d={d}
                    className="fill-[#A5D8F3] dark:fill-[#93C5FD] stroke-white dark:stroke-[#0F172A]"
                    strokeWidth={1}
                    strokeLinejoin="round"
                    data-testid={`province-${feature.properties.code}`}
                  >
                    <title>{feature.properties.name}</title>
                  </path>
                );
              })}
            </g>

            {/* Markers */}
            <g>
              {clusters.map((cluster) => {
                const count = cluster.centers.length;
                const color = clusterColor(count);
                const isHovered = hoveredCluster === cluster.id;
                const r = count > 1 ? 17 : 14;
                return (
                  <g
                    key={cluster.id}
                    transform={`translate(${cluster.x}, ${cluster.y})`}
                    onClick={() => handleClusterClick(cluster)}
                    onMouseEnter={() => setHoveredCluster(cluster.id)}
                    onMouseLeave={() => setHoveredCluster(null)}
                    className="cursor-pointer"
                    data-testid="map-cluster"
                  >
                    <circle
                      r={isHovered ? r + 3 : r}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={2.5}
                      filter="url(#pin-shadow)"
                      style={{ transition: "r 150ms ease" }}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="pointer-events-none select-none"
                      fill="#ffffff"
                      fontSize={count > 9 ? 13 : 15}
                      fontWeight={700}
                    >
                      {count}
                    </text>
                    <title>
                      {count === 1
                        ? cluster.centers[0].name
                        : `${count} centres — ${cluster.centers[0].city}`}
                    </title>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Cluster list */}
          {createPortal(
          <AnimatePresence>
            {openCluster && (
              <motion.div
                className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenCluster(null)}
              >
                <motion.div
                  className="bg-white dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700/50 max-h-[85vh] flex flex-col"
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200 dark:border-gray-700/50">
                    <div className="min-w-0 pr-4">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent truncate">
                        {openCluster.centers[0].city}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {openCluster.centers.length} healthcare centres
                      </p>
                    </div>
                    <button
                      onClick={() => setOpenCluster(null)}
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {openCluster.centers.map((center) => (
                      <button
                        key={center.id}
                        onClick={() => {
                          setOpenCluster(null);
                          setSelectedCenter(center);
                        }}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-600/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                              center.type === "hospital"
                                ? "bg-gradient-to-br from-[#00AFE6] to-[#0088CC]"
                                : center.type === "specialty"
                                  ? "bg-gradient-to-br from-[#00DD89] to-[#00BB77]"
                                  : center.type === "research"
                                    ? "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]"
                                    : "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
                            }`}
                          >
                            {center.type === "hospital" ? (
                              <Hospital className="w-5 h-5" />
                            ) : (
                              <Stethoscope className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                              {center.name}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-[#00DD89] shrink-0" />
                              <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                {center.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
          )}

          {/* Single-centre detail */}
          {createPortal(
          <AnimatePresence>
            {selectedCenter && (
              <motion.div
                className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCenter(null)}
              >
                <motion.div
                  className="relative bg-gray-900/95 backdrop-blur-lg text-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-700 max-h-[85vh] flex flex-col overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-700/80 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </button>

                  {/* Only this region scrolls, so the close button stays put. */}
                  <div className="overflow-y-auto p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6 pr-10">
                    <div
                      className={`w-16 h-16 rounded-full border-4 border-white shadow-xl flex items-center justify-center shrink-0 ${
                        selectedCenter.type === "hospital"
                          ? "bg-gradient-to-br from-[#00AFE6] to-[#0088CC]"
                          : selectedCenter.type === "specialty"
                            ? "bg-gradient-to-br from-[#00DD89] to-[#00BB77]"
                            : selectedCenter.type === "research"
                              ? "bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]"
                              : "bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
                      }`}
                    >
                      {selectedCenter.type === "hospital" ? (
                        <Hospital className="w-8 h-8 text-white drop-shadow-lg" />
                      ) : (
                        <Stethoscope className="w-8 h-8 text-white drop-shadow-lg" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                        {selectedCenter.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-5 h-5 text-[#00DD89]" />
                        <span className="font-medium">
                          {selectedCenter.city}, {selectedCenter.province}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedCenter.specialties.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCenter.specialties.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-2 bg-[#00AFE6]/30 text-[#00AFE6] rounded-full text-sm font-semibold border border-[#00AFE6]/20"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCenter.description && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">About This Center</h4>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedCenter.description}
                        </p>
                      </div>
                    )}

                    {(selectedCenter.contact.address || selectedCenter.contact.phone) && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Contact</h4>
                        <div className="space-y-1.5 text-gray-300 text-sm">
                          {selectedCenter.contact.address && (
                            <p>{selectedCenter.contact.address}</p>
                          )}
                          {selectedCenter.contact.phone && (
                            <p className="font-medium">{selectedCenter.contact.phone}</p>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        // Hand off to the full-details modal; leaving this one
                        // open stacks two dialogs on top of each other.
                        const center = selectedCenter;
                        setSelectedCenter(null);
                        onCenterClick(center);
                      }}
                      className="w-full bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                    >
                      View Full Details
                    </button>
                  </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
          )}
        </div>
      </div>

      {/* Legend + stats */}
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-[#00AFE6]" />
            Marker Legend
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ["#00AFE6", "10+ centres"],
              ["#00DD89", "5–9 centres"],
              ["#7DD3FC", "2–4 centres"],
              ["#F59E0B", "1 centre"],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-white"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#00DD89]" />
            Network Stats
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              [healthcareCenters.length, "Centres"],
              [provinceCount, "Provinces"],
              [clusters.length, "Locations"],
            ].map(([value, label]) => (
              <div key={String(label)} className="text-center">
                <div className="text-lg font-bold bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="text-[#00AFE6]">{label}</div>
              </div>
            ))}
          </div>
          {unplaced.length > 0 && (
            <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
              {unplaced.length} centre{unplaced.length === 1 ? "" : "s"} without a
              known location
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
