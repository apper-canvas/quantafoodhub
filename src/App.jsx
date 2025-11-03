import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "@/components/pages/HomePage";
import SearchPage from "@/components/pages/SearchPage";
import RestaurantPage from "@/components/pages/RestaurantPage";
import OrdersPage from "@/components/pages/OrdersPage";
import AccountPage from "@/components/pages/AccountPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import CartDrawer from "@/components/organisms/CartDrawer";
import FloatingCartButton from "@/components/organisms/FloatingCartButton";
import { useState } from "react";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating Cart Button */}
        <FloatingCartButton onClick={handleOpenCart} />

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;