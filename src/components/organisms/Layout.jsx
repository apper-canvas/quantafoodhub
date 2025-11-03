import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import FloatingCartButton from "@/components/organisms/FloatingCartButton";
import CartDrawer from "@/components/organisms/CartDrawer";

function Layout() {
  // Cart state management
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart handlers
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // Outlet context for child components
  const outletContext = {
    cart: {
      isOpen: isCartOpen,
      openCart: handleOpenCart,
      closeCart: handleCloseCart
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main content area */}
      <Outlet context={outletContext} />

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
  );
}

export default Layout;