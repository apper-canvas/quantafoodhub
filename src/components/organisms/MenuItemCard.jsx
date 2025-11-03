import { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const MenuItemCard = ({ menuItem, restaurantId }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (menuItem.customizations && menuItem.customizations.length > 0) {
      setIsCustomizing(true);
    } else {
addToCart({
        menuItemId: menuItem.Id,
        restaurantId,
        name: menuItem.name,
        image: menuItem.image,
        price: menuItem.price,
        quantity: 1,
        selectedCustomizations: {},
        specialInstructions: ""
      });
    }
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <div className="flex gap-4 p-4">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <h3 className="font-display font-semibold text-gray-900 flex-1">
                {menuItem.name}
              </h3>
              {menuItem.isVeg && (
                <Badge variant="success" className="text-xs">
                  Veg
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {menuItem.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ₹{menuItem.price}
              </span>
              
              {menuItem.isAvailable ? (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="ml-auto"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Add
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="ml-auto"
                >
                  Not Available
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <img
              src={menuItem.image}
              alt={menuItem.name}
              className="w-20 h-20 object-cover rounded-lg"
              loading="lazy"
            />
            {!menuItem.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <span className="text-white text-xs font-medium">N/A</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Customization Modal would be rendered here */}
    </>
  );
};

export default MenuItemCard;