import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { restaurantService } from "@/services/api/restaurantService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import LocationSelector from "@/components/organisms/LocationSelector";
import SearchBar from "@/components/molecules/SearchBar";
import CuisineFilter from "@/components/molecules/CuisineFilter";
import RestaurantCard from "@/components/organisms/RestaurantCard";
import ApperIcon from "@/components/ApperIcon";

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Koramangala");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cuisines = ["Italian", "American", "Indian", "Chinese", "Mexican", "Japanese", "South Indian", "BBQ"];

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await restaurantService.getAll();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = async () => {
    let filtered = [...restaurants];

    // Apply search filter
    if (searchQuery) {
      const searchResults = await restaurantService.searchRestaurants(searchQuery);
      filtered = searchResults;
    }

    // Apply cuisine filter
    if (selectedCuisine !== "all") {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineTypes.some(cuisine =>
          cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        )
      );
    }

    setFilteredRestaurants(filtered);
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCuisine, restaurants]);

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
  };

  const handleRetry = () => {
    loadRestaurants();
  };

  if (loading) {
    return <Loading type="restaurants" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FoodHub
              </h1>
              <p className="text-gray-600 text-sm">
                Delicious food, delivered fast
              </p>
            </div>
            <LocationSelector
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
            />
          </motion.div>

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search restaurants, cuisines..."
            className="mb-4"
          />
        </div>
      </div>

      {/* Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 my-4 p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-card border border-accent/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Free Delivery</h3>
            <p className="text-sm text-gray-600">On orders above ₹299</p>
          </div>
        </div>
      </motion.div>

      {/* Cuisine Filters */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-display font-semibold text-gray-900 mb-3">
          What are you craving?
        </h2>
        <CuisineFilter
          cuisines={cuisines}
          selectedCuisine={selectedCuisine}
          onCuisineSelect={handleCuisineSelect}
        />
      </div>

      {/* Restaurants Grid */}
      <div className="px-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-gray-900">
            {selectedCuisine === "all" ? "All Restaurants" : `${selectedCuisine} Restaurants`}
          </h2>
          <span className="text-sm text-gray-600">
            {filteredRestaurants.length} restaurants
          </span>
        </div>

        {filteredRestaurants.length === 0 ? (
          <Empty
            title="No restaurants found"
            message={
              searchQuery
                ? `No restaurants match "${searchQuery}"`
                : selectedCuisine !== "all"
                ? `No ${selectedCuisine} restaurants available`
                : "No restaurants available in your area"
            }
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCuisine("all");
            }}
            icon="UtensilsCrossed"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantCard
                key={restaurant.Id}
                restaurant={restaurant}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;