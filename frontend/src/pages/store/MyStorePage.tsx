import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyStore, updateMyStoreStatus } from "../../services/store.service";
import { getProductsByStore } from "../../services/product.service";
import { logout } from "../../services/auth.service";

interface Store {
  id: string;
  user_id: string;
  name: string;
  is_open: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export const MyStorePage = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getMyStore();
        setStore(data);
        const productData = await getProductsByStore(data.id);
        setProducts(productData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStore();
  }, []);

  const handleToggleStatus = async () => {
    if (!store) return;
    try {
      const updatedStore = await updateMyStoreStatus(!store.is_open);
      setStore(updatedStore);
    } catch (error) {
      console.error(error);
      alert("Could not update store status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!store) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏪 My Store</h1>
          <button className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold rounded-lg transition-colors" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{store.name}</h2>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${store.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {store.is_open ? "Open" : "Closed"}
              </span>
            </div>
            <div className="mt-6">
              <button
                className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-colors ${store.is_open ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                onClick={handleToggleStatus}
              >
                {store.is_open ? "Close store" : "Open store"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <Link to="/store/create-product" className="block text-center w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors">
            ➕ Create product
          </Link>
          <Link to="/store/orders" className="block text-center w-full py-2 px-4 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors">
            📦 View store orders
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">🛍️ My Products</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-10">
              <span className="text-5xl mb-3">📦</span>
              <p className="text-gray-500">No products yet</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-blue-600 font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
