import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";
import ApperIcon from "@/components/ApperIcon";

const RestaurantCard = ({ restaurant, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant.Id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={handleClick}
    >
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error" className="text-xs">
                Closed
              </Badge>
            </div>
          )}
          
          <div className="absolute top-3 left-3">
            <RatingStars rating={restaurant.rating} size="sm" />
          </div>
          
          {restaurant.isOpen && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="success" className="text-xs">
                <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                {restaurant.deliveryTime}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-display font-semibold text-gray-900 mb-1 truncate">
            {restaurant.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {restaurant.cuisineTypes.join(", ")}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Min. ₹{restaurant.minimumOrder}
            </span>
            
            <div className="flex items-center gap-1 text-success font-medium">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;