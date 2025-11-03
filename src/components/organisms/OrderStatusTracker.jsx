import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const OrderStatusTracker = ({ order }) => {
  const statuses = [
    { key: "confirmed", label: "Order Confirmed", icon: "CheckCircle" },
    { key: "preparing", label: "Preparing", icon: "ChefHat" },
    { key: "picked_up", label: "Picked Up", icon: "Package" },
    { key: "out_for_delivery", label: "Out for Delivery", icon: "Truck" },
    { key: "delivered", label: "Delivered", icon: "Home" },
  ];

  const currentStatusIndex = statuses.findIndex(status => status.key === order.status);

  return (
    <div className="bg-white rounded-card p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-gray-900">
          Order #{order.Id}
        </h3>
        <span className="text-sm text-gray-600">
          {new Date(order.orderTime).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          
          return (
            <div key={status.key} className="flex items-center gap-4">
              <div className="relative">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-gradient-to-r from-success to-success/80 text-white" 
                      : "bg-gray-200 text-gray-400"
                  }`}
                  initial={false}
                  animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name={status.icon} className="w-5 h-5" />
                </motion.div>
                
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                      isCompleted ? "bg-success" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${
                  isCompleted ? "text-gray-900" : "text-gray-500"
                }`}>
                  {status.label}
                </div>
                {isCurrent && (
                  <motion.div 
                    className="text-sm text-success mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    In progress...
                  </motion.div>
                )}
              </div>
              
              {isCurrent && (
                <motion.div
                  className="w-2 h-2 bg-success rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Estimated delivery time:</span>
          <span className="font-semibold text-primary">
            {new Date(order.estimatedDelivery).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;