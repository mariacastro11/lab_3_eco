import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createOrder } from "../../services/order.service";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const homeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationSelector({
  position,
  setPosition,
}: {
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={homeIcon} />
  );
}

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deliveryPos, setDeliveryPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart
      .map((item) =>
        item.product_id === productId ? { ...item, quantity } : item,
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (updatedCart.length === 0) {
      localStorage.removeItem("cart_store_id");
    }
  };

  const handleCreateOrder = async () => {
    const storeId = localStorage.getItem("cart_store_id");

    if (!storeId || cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!deliveryPos) {
      alert("Please select a delivery location on the map");
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        store_id: storeId,
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        delivery_latitude: deliveryPos.lat,
        delivery_longitude: deliveryPos.lng,
      });

      localStorage.removeItem("cart");
      localStorage.removeItem("cart_store_id");
      setCart([]);

      alert("Order created successfully");
      navigate("/consumer/my-orders");
    } catch (error) {
      console.error(error);
      alert("Could not create order");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold mb-8">🛒 Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16">
              <span className="text-6xl mb-4">🛒</span>
              <p className="text-lg text-gray-500">Your cart is empty</p>
              <button
                className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                onClick={() => navigate("/consumer/stores")}
              >
                Browse stores
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {cart.map((item) => (
                <div key={item.product_id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="p-4 flex flex-row items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="font-bold text-lg w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-blue-600 text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Delivery Location</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Click on the map to set your delivery address
                  </p>
                  <div className="h-64 rounded-xl overflow-hidden border border-gray-300">
                    <MapContainer
                      center={[4.6097, -74.0817]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationSelector
                        position={deliveryPos}
                        setPosition={setDeliveryPos}
                      />
                    </MapContainer>
                  </div>
                </div>

                <button
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCreateOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Place order"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
