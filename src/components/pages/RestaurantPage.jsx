import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { restaurantService } from "@/services/api/restaurantService";
import { menuService } from "@/services/api/menuService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import MenuItemCard from "@/components/organisms/MenuItemCard";
import RatingStars from "@/components/molecules/RatingStars";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const RestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [restaurantData, menuData] = await Promise.all([
        restaurantService.getById(id),
        menuService.getByRestaurantId(id)
      ]);
      
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const handleRetry = () => {
    loadRestaurantData();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading type="menu" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (!restaurant) {
    return <Error message="Restaurant not found" onRetry={handleRetry} />;
  }

  const categories = [...new Set(menuItems.map(item => item.category))];
  const filteredMenuItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
        </Button>

        {/* Restaurant Status */}
        <div className="absolute top-4 right-4">
          <Badge
            variant={restaurant.isOpen ? "success" : "error"}
            className="text-sm"
          >
            {restaurant.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-display font-bold mb-2">
              {restaurant.name}
            </h1>
            <p className="text-lg mb-3 opacity-90">
              {restaurant.cuisineTypes.join(" • ")}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <RatingStars rating={restaurant.rating} size="sm" />
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" className="w-4 h-4" />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="bg-white shadow-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {restaurant.rating}
              </div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                ₹{restaurant.minimumOrder}
              </div>
              <div className="text-xs text-gray-600">Min Order</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">
                ₹40
              </div>
              <div className="text-xs text-gray-600">Delivery</div>
            </div>
          </div>
          
          {!restaurant.isOpen && (
            <div className="text-right">
              <div className="text-sm font-medium text-error">Closed</div>
              <div className="text-xs text-gray-600">Opens at 10 AM</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-white border-b p-4">
          <div className="flex gap-2 overflow-x-auto horizontal-scroll">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-chip text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-chip text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {selectedCategory === "all" ? "Menu" : selectedCategory}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredMenuItems.length} items
            </span>
          </div>

          {filteredMenuItems.length === 0 ? (
            <Empty
              title="No menu items"
              message={`No items found${selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}`}
              actionLabel="View All Items"
              onAction={() => setSelectedCategory("all")}
              icon="UtensilsCrossed"
            />
          ) : (
            <div className="space-y-4">
              {filteredMenuItems.map((menuItem, index) => (
                <motion.div
key={menuItem.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MenuItemCard menuItem={menuItem} restaurantId={id} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantPage;