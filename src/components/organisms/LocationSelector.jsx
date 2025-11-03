import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const LocationSelector = ({ currentLocation = "Select Location", onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const locations = [
    { id: 1, name: "Koramangala", area: "Bangalore" },
    { id: 2, name: "HSR Layout", area: "Bangalore" },
    { id: 3, name: "Indiranagar", area: "Bangalore" },
    { id: 4, name: "Whitefield", area: "Bangalore" },
    { id: 5, name: "Electronic City", area: "Bangalore" },
  ];

  const handleLocationSelect = (location) => {
    onLocationChange?.(location.name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ApperIcon name="MapPin" className="w-5 h-5 text-primary" />
        <div className="text-left">
          <div className="text-sm text-gray-600">Deliver to</div>
          <div className="font-medium text-gray-900 truncate max-w-32">
            {currentLocation}
          </div>
        </div>
        <ApperIcon 
          name="ChevronDown" 
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-2 z-50 overflow-hidden"
            >
              <div className="p-3 border-b">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Select Location
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-700">Use current location</span>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {location.area}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;