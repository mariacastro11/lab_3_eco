import { useEffect, useState } from "react";
import { getMyStore, updateMyStoreStatus } from "../../services/store.service";
import { getProductsByStore } from "../../services/product.service";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

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

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="inline-block w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <StorefrontIcon fontSize="large" className="text-orange-600" />
            My Store
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{store.name}</h2>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  store.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {store.is_open ? "Open" : "Closed"}
              </span>
            </div>
            <div className="mt-6">
              <button
                className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-colors ${
                  store.is_open ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleToggleStatus}
              >
                {store.is_open ? "Close store" : "Open store"}
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CategoryIcon className="text-orange-600" /> My Products
        </h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-10 text-gray-300">
              <ProductionQuantityLimitsIcon style={{ fontSize: 60 }} className="mb-3 text-orange-200" />
              <p className="text-gray-500">No products yet</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-orange-600 font-bold">
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
