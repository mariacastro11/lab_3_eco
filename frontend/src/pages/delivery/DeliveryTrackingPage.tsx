import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../services/supabase";
import {
  updateDeliveryLocation,
  markOrderDelivered,
  getOrderDetails,
  getDeliveryLocation,
} from "../../services/order.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MapIcon from "@mui/icons-material/Map";
import StraightenIcon from "@mui/icons-material/Straighten";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const deliveryIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const STEP_LAT = 0.0001;
const STEP_LNG = 0.0001;

// Distance is now calculated in the backend using PostGIS ST_DWithin

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export const DeliveryTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [deliveryPos, setDeliveryPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [destinationPos, setDestinationPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [delivered, setDelivered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deliveryPosRef = useRef(deliveryPos);
  deliveryPosRef.current = deliveryPos;

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const channelReadyRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    const loadData = async () => {
      try {
        const order = await getOrderDetails(orderId);
        // Usar coordenadas por defecto si no existen en la orden
        const destLat = order.delivery_latitude || 4.6097;
        const destLng = order.delivery_longitude || -74.0817;

        setDestinationPos({
          lat: destLat,
          lng: destLng,
        });

        try {
          const loc = await getDeliveryLocation(orderId);
          setDeliveryPos({ 
            lat: loc.latitude || (destLat + 0.005), 
            lng: loc.longitude || (destLng + 0.005) 
          });
        } catch {
          const startLat = destLat + 0.005;
          const startLng = destLng + 0.005;
          setDeliveryPos({ lat: startLat, lng: startLng });

          await updateDeliveryLocation(orderId, startLat, startLng);
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load tracking data",
        );
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase.channel(`delivery-tracking-${orderId}`);
    channel.subscribe((status) => {
      channelReadyRef.current = status === "SUBSCRIBED";
    });
    channelRef.current = channel;

    return () => {
      channelReadyRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const broadcastPosition = useCallback(
    (lat: number, lng: number) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "location-update",
          payload: { latitude: lat, longitude: lng },
        });
      }
    },
    [],
  );

// Distance tracking relies on the backend

  const handleDeliver = async () => {
    if (!orderId || delivered) return;
    try {
      await markOrderDelivered(orderId);
      setDelivered(true);

      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "order-delivered",
          payload: { orderId },
        });
      }
    } catch (err: any) {
      console.error("Failed to mark as delivered:", err);
    }
  };

  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (delivered || !orderId) return;
      const current = deliveryPosRef.current;
      if (!current) return;

      let newLat = current.lat;
      let newLng = current.lng;

      switch (e.key) {
        case "ArrowUp":
          newLat += STEP_LAT;
          break;
        case "ArrowDown":
          newLat -= STEP_LAT;
          break;
        case "ArrowLeft":
          newLng -= STEP_LNG;
          break;
        case "ArrowRight":
          newLng += STEP_LNG;
          break;
        default:
          return;
      }

      e.preventDefault();

      setDeliveryPos({ lat: newLat, lng: newLng });

      try {
        const update = await updateDeliveryLocation(orderId, newLat, newLng);
        broadcastPosition(newLat, newLng);

        if (update.distance !== undefined && update.distance !== null) {
          setDistance(update.distance);
        }
        if (update.isNear && !delivered) {
          handleDeliver();
        }
      } catch (err) {
        console.error("Failed to update location:", err);
      }
    },
    [orderId, delivered, broadcastPosition],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="inline-block w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/delivery/my-deliveries" className="py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2 max-w-fit">
            <ArrowBackIcon fontSize="small" />
            Back to deliveries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between z-[1000] relative">
        <div className="flex items-center gap-4">
          <Link
            to="/delivery/my-deliveries"
            className="px-3 py-1 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-md transition-colors text-sm flex items-center gap-1"
          >
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MapIcon className="text-yellow-600" />
              Delivery Tracking
            </h1>
            <p className="text-sm text-gray-500">
              Order: {orderId?.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {distance !== null && (
            <div className="px-3 py-1 text-sm font-semibold rounded-full border border-gray-600 text-gray-700 flex items-center gap-1">
              <StraightenIcon fontSize="small" /> {distance < 1000 ? `${distance.toFixed(1)} m` : `${(distance / 1000).toFixed(2)} km`}
            </div>
          )}
          {delivered ? (
            <div className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
              <CheckCircleIcon fontSize="small" /> Delivered
            </div>
          ) : (
            <div className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <DirectionsBikeIcon fontSize="small" /> En route
            </div>
          )}
        </div>
      </div>

      {!delivered && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-b border-gray-300 px-6 py-3 z-[1000] relative">
          <div className="max-w-3xl mx-auto flex items-center gap-6 text-sm">
            <span className="font-semibold text-gray-800">
              Use arrow keys to move:
            </span>
            <div className="flex gap-2">
              <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs font-mono shadow-sm">↑</kbd>
              <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs font-mono shadow-sm">↓</kbd>
              <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs font-mono shadow-sm">←</kbd>
              <kbd className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-xs font-mono shadow-sm">→</kbd>
            </div>
            <span className="text-gray-500">
              Get within 5m of the store to complete delivery
            </span>
          </div>
        </div>
      )}

      {delivered && (
        <div className="bg-green-100 border-b border-green-200 px-6 py-4 z-[1000] relative">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CelebrationIcon fontSize="large" className="text-green-600 animate-bounce" />
              <div>
                <p className="font-bold text-lg text-green-700">
                  Order delivered successfully!
                </p>
                <p className="text-sm text-gray-500">
                  The customer has been notified.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/delivery/my-deliveries")}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Back to deliveries
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        {deliveryPos?.lat != null && destinationPos?.lat != null && (
          <MapContainer
            center={[deliveryPos.lat, deliveryPos.lng]}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter lat={deliveryPos.lat} lng={deliveryPos.lng} />

            <Marker
              position={[deliveryPos.lat, deliveryPos.lng]}
              icon={deliveryIcon}
            >
              <Popup>
                <div className="text-center flex flex-col items-center gap-1">
                  <strong className="flex items-center gap-1 text-yellow-700"><DirectionsBikeIcon fontSize="small" /> You (Delivery)</strong>
                  <br />
                  <span className="text-xs text-gray-500">
                    {deliveryPos.lat.toFixed(6)}, {deliveryPos.lng.toFixed(6)}
                  </span>
                </div>
              </Popup>
            </Marker>

            <Marker
              position={[destinationPos.lat, destinationPos.lng]}
              icon={destinationIcon}
            >
              <Popup>
                <div className="text-center flex flex-col items-center gap-1">
                  <strong className="flex items-center gap-1 text-green-700"><LocationOnIcon fontSize="small" /> Destino de entrega</strong>
                  <br />
                  <span className="text-xs text-gray-500">
                    {destinationPos.lat.toFixed(6)}, {destinationPos.lng.toFixed(6)}
                  </span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
};
