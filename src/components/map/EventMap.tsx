import { Box } from "@mui/material";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  lat: number;
  lng: number;
  title?: string;
  height?: number;
};

export const EventMap = ({ lat, lng, title, height = 280 }: Props) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        mb: 2,
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: "100%", height }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        />
        <Marker position={[lat, lng]} icon={markerIcon}>
          {title && <Popup>{title}</Popup>}
        </Marker>
      </MapContainer>
    </Box>
  );
};
