import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStores } from "../../services/store.service";
import { logout } from "../../services/auth.service";

interface Store {
  id: string;
  name: string;
  is_open: boolean;
}

export const StoresPage = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStores();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏪 Stores</h1>
          <div className="flex gap-3">
            <Link to="/consumer/cart" className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg transition-colors">
              🛒 Cart
            </Link>
            <Link to="/consumer/my-orders" className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors">
              📦 My Orders
            </Link>
            <button
              className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16">
              <span className="text-6xl mb-4">🏪</span>
              <p className="text-lg text-gray-500">
                No stores available
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{store.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${store.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {store.is_open ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/consumer/stores/${store.id}/products`}
                      className={`block text-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-4 ${!store.is_open ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                    >
                      View products
                    </Link>
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
