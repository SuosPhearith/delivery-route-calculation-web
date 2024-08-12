"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FC } from "react";

// Fix icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface LocationData {
  id: number;
  latitude: number;
  longitude: number;
  locationName: string;
  phone: string;
  se: string;
  priority: string;
  partOfDay: string;
  capacity: number;
  zone: {
    id: number;
    code: string;
    name: string;
  };
  truckSize: {
    name: string;
    containerCubic: number;
  };
}

interface MapProps {
  locations: any[];
}

const MapRoute: FC<MapProps> = ({ locations }) => {
  return (
    <MapContainer
      center={[11.5564, 104.9282]}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={L.divIcon({
            className: "custom-icon",
            html: `<div style="
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: ${location.priority === "CRITICAL" ? "red" : location.priority === "HIGH" ? "orange" : location.priority === "MEDIUM" ? "yellow" : location.priority === "LOW" ? "lime" : "gray"};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              color: black;
            ">${index + 1}</div>`,
          })}
        >
          <Popup>
            <div>
              <p>
                <strong>Location:</strong> {location.locationName}
              </p>
              <p>
                <strong>Phone:</strong> {location.phone}
              </p>
              <p>
                <strong>SE:</strong> {location.se}
              </p>
              <p>
                <strong>Priority:</strong> {location.priority}
              </p>
              <p>
                <strong>Part of Day:</strong> {location.partOfDay}
              </p>
              <p>
                <strong>Capacity:</strong> {location.capacity} m³
              </p>
              <p>
                <strong>Zone:</strong> {location.zone.name} (
                {location.zone.code})
              </p>
              <p>
                <strong>Truck Size:</strong> {location.truckSize.name} (
                {location.truckSize.containerCubic} m³)
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapRoute;
