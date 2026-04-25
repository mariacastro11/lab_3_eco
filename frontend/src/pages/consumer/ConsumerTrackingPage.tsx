import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../../services/supabase";
import { getDeliveryLocation, getStoreLocation, getOrderDetails } from "../../services/order.service";

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
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export const ConsumerTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [deliveryPos, setDeliveryPos] = useState<{ lat: number; lng: number } | null>(null);
  const [storePos, setStorePos] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [destPos, setDestPos] = useState<{ lat: number; lng: number } | null>(null);
  const [delivered, setDelivered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const loadData = async () => {
      try {
        const store = await getStoreLocation(orderId);
        setStorePos({ lat: store.latitude, lng: store.longitude, name: store.name });

        // Retrieve order to get destination location (delivery_latitude, delivery_longitude)
        const orderData = await getOrderDetails(orderId);

        if (orderData.delivery_latitude && orderData.delivery_longitude) {
          setDestPos({ lat: orderData.delivery_latitude, lng: orderData.delivery_longitude });
        }
        
        if (orderData.status === "Entregado") {
          setDelivered(true);
        }

        try {
          const loc = await getDeliveryLocation(orderId);
          setDeliveryPos({ lat: loc.latitude, lng: loc.longitude });
        } catch {
          // No location yet
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load tracking data");
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  useEffect(() => {
    if (!delivered) return;
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, [delivered]);

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase.channel(`delivery-tracking-${orderId}`);

    channel
      .on("broadcast", { event: "location-update" }, (payload) => {
        setDeliveryPos({ lat: payload.payload.latitude, lng: payload.payload.longitude });
      })
      .on("broadcast", { event: "order-delivered" }, () => {
        setDelivered(true);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  // Polling fallback: re-fetch position from DB every 3 seconds in case broadcast fails
  useEffect(() => {
    if (!orderId || delivered) return;

    const interval = setInterval(async () => {
      try {
        const loc = await getDeliveryLocation(orderId);
        setDeliveryPos({ lat: loc.latitude, lng: loc.longitude });
      } catch {
        // no location yet
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, delivered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/consumer/my-orders" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors inline-block">
            ← Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const mapCenter = deliveryPos || destPos || storePos || { lat: 4.6097, lng: -74.0817 };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between z-[1000] relative">
        <div className="flex items-center gap-4">
          <Link to="/consumer/my-orders" className="px-3 py-1 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-md transition-colors text-sm">
            ← Back
          </Link>
          <div>
            <h1 className="text-xl font-bold">🗺️ Order Tracking</h1>
            <p className="text-sm text-gray-500">Order: {orderId?.slice(0, 8)}...</p>
          </div>
        </div>

        <div>
          {delivered ? (
            <div className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-2 animate-bounce">
              ✅ Delivered! Your order has arrived!
            </div>
          ) : deliveryPos ? (
            <div className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-2">
              🚴 Driver is on the way
            </div>
          ) : (
            <div className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-2">
              ⏳ Waiting for driver location...
            </div>
          )}
        </div>
      </div>

      {delivered && (
        <div className="bg-green-100 border-b border-green-200 px-6 py-4 z-[1000] relative">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">🎉</span>
              <div>
                <p className="font-bold text-lg text-green-700">
                  Your order has arrived!
                </p>
                <p className="text-sm text-gray-500">
                  Enjoy your food.
                </p>
              </div>
            </div>
            <Link to="/consumer/my-orders" className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors inline-block">
              View Orders
            </Link>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-lg flex items-center gap-3 text-green-800">
            <span className="text-lg">🎉</span>
            <span className="font-semibold">¡Tu pedido ha llegado!</span>
          </div>
        </div>
      )}

      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {deliveryPos && <MapRecenter lat={deliveryPos.lat} lng={deliveryPos.lng} />}

          {deliveryPos && (
            <Marker position={[deliveryPos.lat, deliveryPos.lng]} icon={deliveryIcon}>
              <Popup>
                <div className="text-center">
                  <strong>🚴 Driver</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {storePos && (
            <Marker position={[storePos.lat, storePos.lng]} icon={storeIcon}>
              <Popup>
                <div className="text-center">
                  <strong>🏪 {storePos.name}</strong>
                  <br />
                  <span className="text-xs text-gray-500">Store location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {destPos && (
            <Marker position={[destPos.lat, destPos.lng]} icon={destinationIcon}>
              <Popup>
                <div className="text-center">
                  <strong>🏠 Your Location</strong>
                  <br />
                  <span className="text-xs text-gray-500">Delivery destination</span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
