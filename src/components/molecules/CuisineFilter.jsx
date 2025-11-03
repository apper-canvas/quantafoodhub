import { motion } from "framer-motion";

const CuisineFilter = ({ cuisines, selectedCuisine, onCuisineSelect, className = "" }) => {
  return (
    <div className={`flex gap-3 overflow-x-auto horizontal-scroll pb-2 ${className}`}>
      <motion.button
        onClick={() => onCuisineSelect("all")}
        className={`px-4 py-2 rounded-chip text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
          selectedCuisine === "all"
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
            : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        All
      </motion.button>
      
      {cuisines.map((cuisine) => (
        <motion.button
          key={cuisine}
          onClick={() => onCuisineSelect(cuisine)}
          className={`px-4 py-2 rounded-chip text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
            selectedCuisine === cuisine
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {cuisine}
        </motion.button>
      ))}
    </div>
  );
};

export default CuisineFilter;