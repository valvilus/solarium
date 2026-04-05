"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapProps = {
  readonly onSelectPlot: (lat: number, lng: number) => void;
};

type MarkerPos = {
  readonly lat: number;
  readonly lng: number;
};

type LeafletIcon = any;

function MapClickHandler({ onSelectPlot }: { readonly onSelectPlot: (lat: number, lng: number) => void }): null {
  useMapEvents({
    click(e) {
      onSelectPlot(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function InsurAiMap({ onSelectPlot }: MapProps): JSX.Element {
  const [markerPos, setMarkerPos] = useState<MarkerPos | null>(null);
  const [leafletIcon, setLeafletIcon] = useState<LeafletIcon>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setLeafletIcon(icon);
    });
  }, []);

  const handlePlotSelect = (lat: number, lng: number): void => {
    setMarkerPos({ lat, lng });
    onSelectPlot(lat, lng);
  };

  return (
    <div className="w-full h-full rounded-[20px] overflow-hidden shadow-inner relative z-0">
      <MapContainer center={[43.238949, 76.889709]} zoom={9} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelectPlot={handlePlotSelect} />
        {markerPos && leafletIcon && (
          <Marker position={[markerPos.lat, markerPos.lng]} icon={leafletIcon as any}>
            <Popup>
              <div className="font-bold text-sm">Участок выбран</div>
              <div className="text-xs text-neutral-500 font-mono">
                {markerPos.lat.toFixed(4)}°, {markerPos.lng.toFixed(4)}°
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
