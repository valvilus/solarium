"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ALMATY_CENTER: L.LatLngTuple = [43.222, 76.8512];
const DEFAULT_ZOOM = 14;

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

type MapClickHandlerProps = {
  readonly onAdd: (p: PolygonPoint) => void;
};

function MapClickHandler({ onAdd }: MapClickHandlerProps): null {
  useMapEvents({
    click(e) {
      onAdd({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function computeAreaHectares(points: readonly PolygonPoint[]): number {
  if (points.length < 3) return 0;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].lng * points[j].lat;
    area -= points[j].lng * points[i].lat;
  }
  area = Math.abs(area) / 2;
  const metersPerDegLat = 111320;
  const avgLat = points.reduce((s, p) => s + p.lat, 0) / n;
  const metersPerDegLng = 111320 * Math.cos((avgLat * Math.PI) / 180);
  const areaSqMeters = area * metersPerDegLat * metersPerDegLng;
  return areaSqMeters / 10000;
}

function computeCentroid(points: readonly PolygonPoint[]): PolygonPoint {
  const n = points.length;
  const lat = points.reduce((s, p) => s + p.lat, 0) / n;
  const lng = points.reduce((s, p) => s + p.lng, 0) / n;
  return { lat, lng };
}

type InsurAiSatelliteMapProps = {
  readonly onAreaSelect: (centroid: PolygonPoint, areaHa: number) => void;
};

export default function InsurAiSatelliteMap({ onAreaSelect }: InsurAiSatelliteMapProps): JSX.Element {
  const [points, setPoints] = useState<PolygonPoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

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
    const areaHa = computeAreaHectares(points);
    onAreaSelect(centroid, areaHa);
  }, [points, onAreaSelect]);

  const resetPolygon = useCallback((): void => {
    setPoints([]);
    setIsComplete(false);
  }, []);

  const areaHa = computeAreaHectares(points);
  const polygonPositions: L.LatLngTuple[] = points.map((p) => [p.lat, p.lng]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E2E8F0]">
      <MapContainer
        center={ALMATY_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full z-0"
        style={{ minHeight: "500px" }}
        zoomControl={false}
      >
        <TileLayer url={ESRI_SATELLITE_URL} maxZoom={19} />
        <TileLayer url={ESRI_LABEL_URL} maxZoom={19} />

        {!isComplete && <MapClickHandler onAdd={addPoint} />}

        {polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: "#059669",
              weight: 2,
              fillColor: isComplete ? "#059669" : "#10B981",
              fillOpacity: isComplete ? 0.35 : 0.15,
              dashArray: isComplete ? undefined : "6",
            }}
          />
        )}

        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]} icon={VERTEX_ICON} />
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] px-3 py-1.5 rounded-full flex items-center gap-2 z-[1000] shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
        <span className="text-xs font-semibold text-slate-700">Esri Satellite</span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center justify-between">
        <div className="bg-white/95 backdrop-blur-sm border border-[#E2E8F0] rounded-xl px-4 py-2.5 shadow-md flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            {points.length === 0 && "Кликайте по карте чтобы обозначить границы участка"}
            {points.length > 0 && points.length < 3 && `Точек: ${points.length} (мин. 3 для замыкания)`}
            {points.length >= 3 && !isComplete && (
              <>
                <span className="font-mono text-[#0F172A] font-bold">{areaHa.toFixed(1)} Га</span>
                <span className="text-slate-400 mx-1">|</span>
                <span>{points.length} точек</span>
              </>
            )}
            {isComplete && <span className="text-[#059669] font-bold">Участок выбран: {areaHa.toFixed(1)} Га</span>}
          </span>
        </div>

        <div className="flex gap-2">
          {points.length >= 3 && !isComplete && (
            <button
              onClick={closePolygon}
              className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Замкнуть Участок
            </button>
          )}
          {points.length > 0 && (
            <button
              onClick={resetPolygon}
              className="bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
