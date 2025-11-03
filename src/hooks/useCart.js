import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

const addToCart = useCallback((item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.menuItemId === item.menuItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
updatedItems[existingItemIndex].quantity += (item.quantity || 1);
        updatedItems[existingItemIndex].itemTotal = 
          updatedItems[existingItemIndex].quantity * item.price;
        
        toast.success(`Updated ${item.name} quantity`, {
          position: "top-right",
          autoClose: 2000,
        });
        
        return updatedItems;
      } else {
toast.success(`Added ${item.name} to cart`, {
          position: "top-right",
          autoClose: 2000,
        });
        
        const newItem = {
          ...item,
          quantity: item.quantity || 1,
          itemTotal: (item.quantity || 1) * item.price
        };
        
        return [...prevItems, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((menuItemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.menuItemId !== menuItemId);
      toast.info("Item removed from cart", {
        position: "top-right",
        autoClose: 2000,
      });
      return updatedItems;
    });
  }, []);

  const updateQuantity = useCallback((menuItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.menuItemId === menuItemId
          ? { ...item, quantity: newQuantity, itemTotal: newQuantity * item.price }
          : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared", {
      position: "top-right",
      autoClose: 2000,
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.itemTotal, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };
};