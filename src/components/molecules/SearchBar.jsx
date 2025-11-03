import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ onSearch, placeholder = "Search restaurants, cuisines...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </div>
      
      {isFocused && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-1 p-2 z-50"
        >
          <div className="text-sm text-gray-500 px-2 py-1">
            Recent searches
          </div>
          <div className="space-y-1">
            {["Pizza", "Burger", "Chinese", "Italian"].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              >
                <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;