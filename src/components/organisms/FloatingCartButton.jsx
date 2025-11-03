import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import ApperIcon from "@/components/ApperIcon";

const FloatingCartButton = ({ onClick }) => {
  const { cartItems, getCartTotal } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getCartTotal();

// Always show cart button for accessibility

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-2xl z-30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ApperIcon name="ShoppingCart" className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </div>
        </div>
        <div className="text-sm font-medium">
          ₹{cartTotal.toFixed(2)}
        </div>
      </div>
    </motion.button>
  );
};

export default FloatingCartButton;