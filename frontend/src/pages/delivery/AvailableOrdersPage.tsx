import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  acceptOrder,
  getAvailableOrders,
  rejectOrder,
} from "../../services/order.service";
import { logout } from "../../services/auth.service";

interface Order {
  id: string;
  user_id: string;
  store_id: string;
  stores: { name: string };
  delivery_id: string | null;
  created_at?: string;
}

export const AvailableOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingAction, setLoadingAction] = useState<{
    id: string | null;
    type: "accept" | "reject" | null;
  }>({
    id: null,
    type: null,
  });

  const fetchOrders = async () => {
    try {
      const data = await getAvailableOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const cleanId = String(orderId).trim();
      setLoadingAction({ id: cleanId, type: "accept" });
      await acceptOrder(cleanId);
      navigate(`/delivery/tracking/${cleanId}`);
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Could not accept order");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const cleanId = String(orderId).trim();
      setLoadingAction({ id: cleanId, type: "reject" });
      await rejectOrder(cleanId);
      alert("Order rejected successfully");
      fetchOrders();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Could not reject order");
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Orders</h1>
          <div className="flex gap-3">
            <Link to="/delivery/my-deliveries" className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors">
              My Deliveries
            </Link>
            <button
              className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16">
              <p className="text-lg text-gray-500">
                No available orders
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Order</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Available</span>
                  </div>

                  <div className="text-sm text-gray-500 flex flex-col gap-1 mb-4">
                    <p>
                      <span className="font-medium text-gray-900">ID:</span>{" "}
                      {order.id}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Customer:
                      </span>{" "}
                      {order.user_id}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Store:
                      </span>{" "}
                      {order.stores?.name || order.store_id}
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

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={loadingAction.id === order.id}
                    >
                      {loadingAction.id === order.id &&
                      loadingAction.type === "accept"
                        ? "Loading..."
                        : "Accept order"}
                    </button>

                    <button
                      className="flex-1 py-2 px-4 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      onClick={() => handleRejectOrder(order.id)}
                      disabled={loadingAction.id === order.id}
                    >
                      {loadingAction.id === order.id &&
                      loadingAction.type === "reject"
                        ? "Loading..."
                        : "Reject order"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
