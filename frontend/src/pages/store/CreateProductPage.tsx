import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/product.service";

export const CreateProductPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createProduct({ name, price: Number(price) });
      alert("Product created successfully");
      navigate("/store/my-store");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Could not create product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-8">
          <button
            className="px-3 py-1 border border-gray-600 text-gray-700 hover:bg-gray-600 hover:text-white font-semibold rounded-md transition-colors text-sm mb-4 flex items-center gap-2 self-start"
            onClick={() => navigate("/store/my-store")}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-center mb-2">
            ➕ Create Product
          </h1>
          <p className="text-center text-gray-500 mb-4">
            Add a new product to your store
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="flex items-center pb-2">
                <span className="text-sm font-medium text-gray-700">Product name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Burger, Pizza..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center pb-2">
                <span className="text-sm font-medium text-gray-700">Price</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors mt-2">
              Create product
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};
