import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="ChefHat" size={64} className="text-primary" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we can't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="space-y-4"
        >
          <Button
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Go to Home
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/search")}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              Search Restaurants
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate("/orders")}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              My Orders
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => navigate("/account")}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              Account
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;