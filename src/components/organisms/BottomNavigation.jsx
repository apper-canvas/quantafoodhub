import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "Home",
      path: "/",
    },
    {
      id: "search",
      label: "Search",
      icon: "Search",
      path: "/search",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "Package",
      path: "/orders",
    },
    {
      id: "account",
      label: "Account",
      icon: "User",
      path: "/account",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <ApperIcon
                  name={item.icon}
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-primary" : "text-gray-500"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;