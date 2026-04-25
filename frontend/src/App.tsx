import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

// Layouts
import { ConsumerLayout } from "./layouts/ConsumerLayout";
import { StoreLayout } from "./layouts/StoreLayout";
import { DeliveryLayout } from "./layouts/DeliveryLayout";

// Consumer
import { StoresPage } from "./pages/consumer/StoresPage";
import { ProductsPage } from "./pages/consumer/ProductsPage";
import { CartPage } from "./pages/consumer/CartPage";
import { MyOrdersPage } from "./pages/consumer/MyOrdersPage";
import { ConsumerTrackingPage } from "./pages/consumer/ConsumerTrackingPage";

// Store
import { MyStorePage } from "./pages/store/MyStorePage";
import { CreateProductPage } from "./pages/store/CreateProductPage";
import { StoreOrdersPage } from "./pages/store/StoreOrdersPage";

// Delivery
import { AvailableOrdersPage } from "./pages/delivery/AvailableOrdersPage";
import { MyDeliveriesPage } from "./pages/delivery/MyDeliveriesPage";
import { DeliveryTrackingPage } from "./pages/delivery/DeliveryTrackingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Consumer Layout */}
        <Route path="/consumer" element={<ConsumerLayout />}>
          <Route path="stores" element={<StoresPage />} />
          <Route path="stores/:storeId/products" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="tracking/:orderId" element={<ConsumerTrackingPage />} />
        </Route>

        {/* Store Layout */}
        <Route path="/store" element={<StoreLayout />}>
          <Route path="my-store" element={<MyStorePage />} />
          <Route path="create-product" element={<CreateProductPage />} />
          <Route path="orders" element={<StoreOrdersPage />} />
        </Route>

        {/* Delivery Layout */}
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route path="available-orders" element={<AvailableOrdersPage />} />
          <Route path="my-deliveries" element={<MyDeliveriesPage />} />
          <Route path="tracking/:orderId" element={<DeliveryTrackingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
