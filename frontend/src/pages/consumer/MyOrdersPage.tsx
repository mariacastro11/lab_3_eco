import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/order.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InboxIcon from "@mui/icons-material/Inbox";
import MyLocationIcon from "@mui/icons-material/MyLocation";

interface Order {
  id: string;
  user_id: string;
  store_id: string;
  stores: { name: string };
  delivery_id: string | null;
  created_at?: string;
}

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ReceiptLongIcon fontSize="large" className="text-amber-600" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16 text-gray-300">
              <InboxIcon style={{ fontSize: 80 }} className="mb-4 text-amber-200" />
              <p className="text-lg text-gray-500">No orders yet</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Order</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${order.delivery_id ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {order.delivery_id ? "Assigned" : "Pending"}
                    </span>
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
                        Delivery:
                      </span>{" "}
                      {order.delivery_id || "Not assigned yet"}
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

                  {order.delivery_id && (
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/consumer/tracking/${order.id}`}
                        className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1"
                      >
                        <MyLocationIcon fontSize="small" />
                        Track Order
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
