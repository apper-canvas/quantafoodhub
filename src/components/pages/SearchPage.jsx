import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { restaurantService } from "@/services/api/restaurantService";
import { menuService } from "@/services/api/menuService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import RestaurantCard from "@/components/organisms/RestaurantCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("restaurants");
  const [filters, setFilters] = useState({
    rating: "",
    priceRange: "",
    deliveryTime: "",
    cuisineType: "",
    isVeg: false,
  });

  const performSearch = async (query) => {
    if (!query.trim()) {
      setRestaurants([]);
      setMenuItems([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const [restaurantResults, menuResults] = await Promise.all([
        restaurantService.searchRestaurants(query),
        menuService.searchMenuItems(query)
      ]);
      
      setRestaurants(restaurantResults);
      setMenuItems(menuResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const applyFilters = () => {
    let filtered = [...restaurants];

    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(restaurant => restaurant.rating >= minRating);
    }

    if (filters.priceRange) {
      const maxPrice = parseInt(filters.priceRange);
      filtered = filtered.filter(restaurant => restaurant.minimumOrder <= maxPrice);
    }

    if (filters.deliveryTime) {
      const maxTime = parseInt(filters.deliveryTime);
      filtered = filtered.filter(restaurant => {
        const time = parseInt(restaurant.deliveryTime.split("-")[0]);
        return time <= maxTime;
      });
    }

    if (filters.cuisineType) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineTypes.some(cuisine =>
          cuisine.toLowerCase().includes(filters.cuisineType.toLowerCase())
        )
      );
    }

    setRestaurants(filtered);
  };

  const clearFilters = () => {
    setFilters({
      rating: "",
      priceRange: "",
      deliveryTime: "",
      cuisineType: "",
      isVeg: false,
    });
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  const handleRetry = () => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Search
            </h1>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search restaurants, dishes, cuisines..."
            />
          </motion.div>

          {/* Search Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "restaurants"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Restaurants ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab("dishes")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "dishes"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dishes ({menuItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary"
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Any Price</option>
              <option value="200">Under ₹200</option>
              <option value="300">Under ₹300</option>
              <option value="500">Under ₹500</option>
            </select>

            <select
              value={filters.deliveryTime}
              onChange={(e) => setFilters({ ...filters, deliveryTime: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Any Time</option>
              <option value="20">Under 20 min</option>
              <option value="30">Under 30 min</option>
              <option value="45">Under 45 min</option>
            </select>

            <input
              type="text"
              value={filters.cuisineType}
              onChange={(e) => setFilters({ ...filters, cuisineType: e.target.value })}
              placeholder="Cuisine type..."
              className="p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isVeg}
                onChange={(e) => setFilters({ ...filters, isVeg: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Vegetarian Only</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      <div className="p-4 pb-20">
        {loading ? (
          <Loading type="restaurants" />
        ) : error ? (
          <Error message={error} onRetry={handleRetry} />
        ) : !searchQuery ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ApperIcon name="Search" className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
              Search for food
            </h3>
            <p className="text-gray-600 mb-6">
              Find restaurants, dishes, and cuisines
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Pizza", "Burger", "Biryani", "Chinese", "South Indian"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        ) : activeTab === "restaurants" ? (
          restaurants.length === 0 ? (
            <Empty
              title="No restaurants found"
              message={`No restaurants match "${searchQuery}"`}
              actionLabel="Try Different Search"
              onAction={() => setSearchQuery("")}
              icon="UtensilsCrossed"
            />
          ) : (
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Restaurants for "{searchQuery}"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {restaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.Id}
                    restaurant={restaurant}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          menuItems.length === 0 ? (
            <Empty
              title="No dishes found"
              message={`No dishes match "${searchQuery}"`}
              actionLabel="Try Different Search"
              onAction={() => setSearchQuery("")}
              icon="UtensilsCrossed"
            />
          ) : (
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
                Dishes for "{searchQuery}"
              </h2>
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">₹{item.price}</span>
                        <Button size="sm">
                          <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;