"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: L.LatLngTuple = [15.5007, 32.5599];
const DEFAULT_ZOOM = 13;

const ESRI_SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_LABEL_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}";

const VERTEX_ICON = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;background:#059669;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

type PolygonPoint = {
  readonly lat: number;
  readonly lng: number;
};

const getHeatColor = (temp: number | null): { fill: string; stroke: string } => {
  if (temp === null) return { fill: "#10B981", stroke: "#059669" };
  if (temp >= 35) return { fill: "#EF4444", stroke: "#DC2626" };
  if (temp >= 30) return { fill: "#F97316", stroke: "#EA580C" };
  if (temp >= 20) return { fill: "#EAB308", stroke: "#CA8A04" };
  if (temp >= 10) return { fill: "#84CC16", stroke: "#65A30D" };
  return { fill: "#3B82F6", stroke: "#2563EB" };
};

function computeCentroid(points: readonly PolygonPoint[]): PolygonPoint {
  const n = points.length;
  if (n === 0) return { lat: 0, lng: 0 };
  const lat = points.reduce((s, p) => s + p.lat, 0) / n;
  const lng = points.reduce((s, p) => s + p.lng, 0) / n;
  return { lat, lng };
}

type ClaimsMapWidgetProps = {
  readonly startData: string;
  readonly endData: string;
  readonly avgTemp: number | null;
  readonly onPolygonSet: (centroid: PolygonPoint) => void;
  readonly initialLat?: number;
  readonly initialLng?: number;
};

function MapEvents({ onAdd }: { onAdd: (p: PolygonPoint) => void }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapUpdater({ center }: { center: L.LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function ClaimsMapWidget({
  startData,
  endData,
  avgTemp,
  onPolygonSet,
  initialLat,
  initialLng,
}: ClaimsMapWidgetProps): JSX.Element {
  const [points, setPoints] = useState<PolygonPoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) {
      const offset = 0.005;
      const presetPoints = [
        { lat: initialLat + offset, lng: initialLng - offset },
        { lat: initialLat + offset, lng: initialLng + offset },
        { lat: initialLat - offset, lng: initialLng + offset },
        { lat: initialLat - offset, lng: initialLng - offset },
      ];
      setPoints(presetPoints);
      setIsComplete(true);
    }
  }, [initialLat, initialLng]);

  const addPoint = useCallback(
    (p: PolygonPoint): void => {
      if (isComplete) return;
      setPoints((prev) => [...prev, p]);
    },
    [isComplete]
  );

  const closePolygon = useCallback((): void => {
    if (points.length < 3) return;
    setIsComplete(true);
    const centroid = computeCentroid(points);
    onPolygonSet(centroid);
  }, [points, onPolygonSet]);

  const resetPolygon = useCallback((): void => {
    setPoints([]);
    setIsComplete(false);
  }, []);

  const polygonPositions: L.LatLngTuple[] = points.map((p) => [p.lat, p.lng]);
  const styles = getHeatColor(avgTemp);
  const mapCenter = useMemo(
    (): L.LatLngTuple =>
      initialLat !== undefined && initialLng !== undefined ? [initialLat, initialLng] : DEFAULT_CENTER,
    [initialLat, initialLng]
  );

  const centroid = useMemo(() => (isComplete ? computeCentroid(points) : null), [points, isComplete]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm group"
      style={{ height: "400px" }}
    >
      <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} className="w-full h-full z-0" zoomControl={false}>
        <MapUpdater center={mapCenter} />
        <TileLayer url={ESRI_SATELLITE_URL} maxZoom={19} />
        <TileLayer url={ESRI_LABEL_URL} maxZoom={19} />

        {avgTemp !== null && (
          <div
            className="absolute inset-0 pointer-events-none z-[400] transition-opacity duration-1000 mix-blend-color"
            style={{
              backgroundColor:
                avgTemp >= 35
                  ? "rgba(239, 68, 68, 0.4)"
                  : avgTemp >= 30
                    ? "rgba(249, 115, 22, 0.3)"
                    : "rgba(59, 130, 246, 0.2)",
              opacity: isComplete ? 1 : 0.5,
            }}
          />
        )}

        {!isComplete && <MapEvents onAdd={addPoint} />}

        {polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: styles.stroke,
              weight: 3,
              fillColor: styles.fill,
              fillOpacity: isComplete && avgTemp !== null ? 0.6 : isComplete ? 0.35 : 0.15,
              dashArray: isComplete ? undefined : "6",
            }}
          />
        )}

        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={VERTEX_ICON} />
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-200 shadow-md flex flex-col gap-1 min-w-[220px]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Тепловая Карта</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {startData || "Не выбрано"} &rarr; {endData || "Не выбрано"}
        </div>
        {centroid && (
          <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            <span>
              [Lat: {centroid.lat.toFixed(4)}, Lng: {centroid.lng.toFixed(4)}]
            </span>
          </div>
        )}
        {avgTemp !== null && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">t° полигона:</span>
            <span className="text-sm font-black font-mono" style={{ color: styles.stroke }}>
              {avgTemp > 0 ? "+" : ""}
              {avgTemp.toFixed(1)}°C
            </span>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-between items-center bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-200">
        <div className="text-xs font-medium text-slate-600">
          {points.length === 0 && "Кликайте по спутнику, чтобы очертить ферму"}
          {points.length > 0 && points.length < 3 && `Идет построение... (${points.length} точек)`}
          {points.length >= 3 && !isComplete && "Контур готов к замыканию"}
          {isComplete && (
            <span className="text-[#059669] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" /> Участок зафиксирован. Ожидание
              оракула...
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {points.length >= 3 && !isComplete && (
            <button
              type="button"
              onClick={closePolygon}
              className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
            >
              Привязать Координаты
            </button>
          )}
          {points.length > 0 && (
            <button
              type="button"
              onClick={resetPolygon}
              className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Сброс / Заново
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
