import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React, { useState } from "react";
import HomePage from "@/components/pages/HomePage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import AccountPage from "@/components/pages/AccountPage";
import SearchPage from "@/components/pages/SearchPage";
import OrdersPage from "@/components/pages/OrdersPage";
import RestaurantPage from "@/components/pages/RestaurantPage";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import FloatingCartButton from "@/components/organisms/FloatingCartButton";
import CartDrawer from "@/components/organisms/CartDrawer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/restaurant/:id",
    element: <RestaurantPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/account",
    element: <AccountPage />,
  },
]);

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
      <BottomNavigation />
      <FloatingCartButton onOpenCart={handleOpenCart} />
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />
      <ToastContainer />
    </div>
  );
}

export default App;