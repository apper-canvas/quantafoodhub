import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('foodhub_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('foodhub_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);
const addToCart = useCallback((item) => {
    if (!item.menuItemId || !item.price || !item.name) {
      console.error('Invalid item data:', item);
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.menuItemId === item.menuItemId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + (item.quantity || 1);
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          itemTotal: newQuantity * updatedItems[existingItemIndex].price
        };
        
        toast.success(`Updated ${item.name} quantity to ${newQuantity}`, {
          position: "top-right",
          autoClose: 2000,
        });
        
        return updatedItems;
      } else {
        const newItem = {
          menuItemId: item.menuItemId,
          restaurantId: item.restaurantId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity || 1,
          selectedCustomizations: item.selectedCustomizations || {},
          specialInstructions: item.specialInstructions || "",
          itemTotal: (item.quantity || 1) * item.price
        };
        
        toast.success(`Added ${item.name} to cart`, {
          position: "top-right",
          autoClose: 2000,
        });
        
        return [...prevItems, newItem];
      }
    });
  }, []);

const removeFromCart = useCallback((menuItemId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.menuItemId === menuItemId);
      const updatedItems = prevItems.filter(item => item.menuItemId !== menuItemId);
      
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.name} from cart`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
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
          ? { 
              ...item, 
              quantity: newQuantity, 
              itemTotal: newQuantity * item.price 
            }
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

const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

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
    totalItems,
    totalAmount,
    getCartTotal,
    getCartItemCount,
  };
};