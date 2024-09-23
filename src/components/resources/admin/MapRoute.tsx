"use client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { FC, useEffect } from "react";
import L from "leaflet";

// Fix icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export interface CenterMap {
  lat: number;
  long: number;
}

interface MapProps {
  locations: any[];
  center: CenterMap;
  onClickMarker: (location: any) => void;
  clickedMarker: { id: number }[];
}

const MapRoute: FC<MapProps> = ({
  locations,
  center,
  onClickMarker,
  clickedMarker,
}) => {
  const handleMarkerClick = (location: any) => {
    onClickMarker(location);
  };

  const isMarkerClicked = (locationId: number) => {
    return clickedMarker.some((marker) => marker.id === locationId);
  };

  return (
    <MapContainer
      center={[center.lat, center.long]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ChangeView center={center} />
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
              border: 1px solid black;
              background-color: ${
                isMarkerClicked(location.id)
                  ? "blue"
                  : location.priority === "CRITICAL"
                    ? "#7d0707"
                    : location.priority === "HIGH"
                      ? "#cf5a17"
                      : location.priority === "MEDIUM"
                        ? "#bd8b28"
                        : location.priority === "LOW"
                          ? "lime"
                          : "gray"
              };
              width: 25px;
              height: 25px;
              border-radius: 50%;
              color: white;
            ">${index + 1}</div>`,
          })}
          eventHandlers={{
            click: () => handleMarkerClick(location),
          }}
        ></Marker>
      ))}
    </MapContainer>
  );
};

interface ChangeViewProps {
  center: CenterMap;
}

const ChangeView: FC<ChangeViewProps> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.long], map.getZoom());
  }, [center, map]);

  return null;
};

export default MapRoute;
