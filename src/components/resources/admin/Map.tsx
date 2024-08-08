"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FC } from "react";
import Link from "next/link";

// Fix icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MarkerData {
  position: [number, number];
  popupText: any;
}

interface MapProps {
  markerGroups: MarkerData[][];
  colors: string[];
}

const createCustomMarker = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
  });
};

const Map: FC<MapProps> = ({ markerGroups, colors }) => {
  return (
    <MapContainer
      center={[11.5564, 104.9282]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markerGroups.map((group, groupIndex) => {
        const color = colors[groupIndex % colors.length];
        return (
          <>
            {group.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={createCustomMarker(color)}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>Route:</strong> {marker.popupText.route}
                    </p>
                    <p>
                      <strong>Name:</strong> {marker.popupText.name}
                    </p>
                    <p>
                      <strong>Status:</strong> {marker.popupText.status}
                    </p>
                    <p>
                      <strong>Type:</strong> {marker.popupText.type}
                    </p>
                    <Link href={`?query=${marker.popupText.route}`}>
                      Show Detail
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline
              key={`polyline-${groupIndex}`}
              positions={group.map((marker) => marker.position)}
              color={color}
            />
          </>
        );
      })}
    </MapContainer>
  );
};

export default Map;
