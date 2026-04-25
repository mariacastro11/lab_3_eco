import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyDeliveries } from "../../services/order.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MopedIcon from "@mui/icons-material/Moped";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import MapIcon from "@mui/icons-material/Map";

interface Order {
  id: string;
  user_id: string;
  store_id: string;
  stores: { name: string };
  profiles: { name: string };
  delivery_id: string | null;
  status: string;
  created_at?: string;
}

export const MyDeliveriesPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyDeliveries();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En entrega":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En entrega</span>;
      case "Entregado":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Entregado</span>;
      case "Creado":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Creado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors mb-4 flex items-center gap-2"
          onClick={() => navigate("/delivery/available-orders")}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <MopedIcon fontSize="large" className="text-sky-600" />
          My Deliveries
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16 text-gray-300">
              <DirectionsBikeIcon style={{ fontSize: 80 }} className="mb-4 text-sky-200" />
              <p className="text-lg text-gray-500">No deliveries yet</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Order</h3>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="text-sm text-gray-500 flex flex-col gap-1">
                    <p>
                      <span className="font-medium text-gray-900">ID:</span>{" "}
                      {order.id}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Store:
                      </span>{" "}
                      {order.stores?.name || order.store_id}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Customer:
                      </span>{" "}
                      {order.profiles?.name || order.user_id}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Date:
                      </span>{" "}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "No date"}
                    </p>
                  </div>

                  {order.status === "En entrega" && (
                    <div className="mt-4">
                      <Link
                        to={`/delivery/tracking/${order.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      >
                        <MapIcon fontSize="small" /> Track Order
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

