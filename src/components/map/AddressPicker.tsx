import { Box, Stack, TextField } from "@mui/material";
import L from "leaflet";
import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  value: {
    address: string;
    latitude?: number | null;
    longitude?: number | null;
  };
  onChange: (next: {
    address: string;
    latitude?: number | null;
    longitude?: number | null;
  }) => void;
  height?: number;
  defaultCenter?: { lat: number; lng: number };
};

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const AddressPicker = ({
  value,
  onChange,
  height = 300,
  defaultCenter = { lat: 44.8125, lng: 20.4612 },
}: Props) => {
  const markerPosition = useMemo(() => {
    if (value.latitude != null && value.longitude != null)
      return [value.latitude, value.longitude] as [number, number];
    return [defaultCenter.lat, defaultCenter.lng] as [number, number];
  }, [value.latitude, value.longitude, defaultCenter]);

  const reverseGeocode = async (lat: number, lng: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const json = await res.json();
    const displayName = json?.display_name as string | undefined;
    onChange({
      address: displayName ?? value.address,
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <Stack spacing={1}>
      <TextField
        label="Adresa"
        value={value.address}
        onChange={(e) => onChange({ ...value, address: e.target.value })}
        fullWidth
      />

      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <MapContainer
          center={markerPosition}
          zoom={15}
          scrollWheelZoom={false}
          style={{ width: "100%", height }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          />
          <ClickHandler
            onPick={(lat, lng) => {
              onChange({ ...value, latitude: lat, longitude: lng });
              reverseGeocode(lat, lng);
            }}
          />
          <Marker
            draggable
            position={markerPosition}
            icon={markerIcon}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const p = m.getLatLng();
                onChange({ ...value, latitude: p.lat, longitude: p.lng });
                void reverseGeocode(p.lat, p.lng);
              },
            }}
          >
            <Popup>
              {value.address || "Pomerite marker ili kliknite na mapu"}
            </Popup>
          </Marker>
        </MapContainer>
      </Box>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Lat"
          value={value.latitude ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              latitude: e.target.value ? Number(e.target.value) : null,
            })
          }
          sx={{ maxWidth: 200 }}
        />
        <TextField
          label="Lng"
          value={value.longitude ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              longitude: e.target.value ? Number(e.target.value) : null,
            })
          }
          sx={{ maxWidth: 200 }}
        />
      </Stack>
    </Stack>
  );
};
