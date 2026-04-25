import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductsByStore } from "../../services/product.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) return;
      try {
        const data = await getProductsByStore(storeId);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [storeId]);

  const addToCart = (product: Product) => {
    const currentCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    const currentStoreId = localStorage.getItem("cart_store_id");

    if (currentStoreId && currentStoreId !== storeId) {
      alert("You can only buy from one store at a time");
      return;
    }

    const existingItem = currentCart.find(
      (item) => item.product_id === product.id,
    );
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = currentCart.map((item) =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      updatedCart = [
        ...currentCart,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cart_store_id", String(storeId));
    alert("Product added to cart");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          className="px-4 py-2 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-lg transition-colors mb-4 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CategoryIcon fontSize="large" className="text-emerald-600" />
            Products
          </h1>
          <Link to="/consumer/cart" className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-colors">
            <ShoppingCartIcon fontSize="small" />
            Go to cart
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 flex flex-col items-center justify-center py-16 text-gray-300">
              <ProductionQuantityLimitsIcon style={{ fontSize: 80 }} className="mb-4 text-emerald-200" />
              <p className="text-lg text-gray-500">
                No products available
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-emerald-600 font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <button
                      className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
                      onClick={() => addToCart(product)}
                    >
                      <AddShoppingCartIcon fontSize="small" />
                      Add to cart
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
