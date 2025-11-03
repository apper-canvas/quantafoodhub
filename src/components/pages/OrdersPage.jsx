import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { orderService } from "@/services/api/orderService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import OrderStatusTracker from "@/components/organisms/OrderStatusTracker";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const OrdersPage = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [active, history] = await Promise.all([
        orderService.getActiveOrders(),
        orderService.getOrderHistory()
      ]);
      
      setActiveOrders(active);
      setOrderHistory(history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRetry = () => {
    loadOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "info";
      case "preparing": return "warning";
      case "picked_up": return "warning";
      case "out_for_delivery": return "warning";
      case "delivered": return "success";
      default: return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed": return "Confirmed";
      case "preparing": return "Preparing";
      case "picked_up": return "Picked Up";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      default: return status;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  const currentOrders = activeTab === "active" ? activeOrders : orderHistory;

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
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your orders and view history
            </p>
          </motion.div>

          {/* Order Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              History ({orderHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 pb-20">
        {currentOrders.length === 0 ? (
          <Empty
            title={activeTab === "active" ? "No active orders" : "No order history"}
            message={
              activeTab === "active"
                ? "You don't have any active orders right now"
                : "You haven't placed any orders yet"
            }
            actionLabel="Browse Restaurants"
            onAction={() => window.location.href = "/"}
            icon="Package"
          />
        ) : (
          <div className="space-y-4">
            {currentOrders.map((order, index) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {activeTab === "active" && activeOrders.some(o => o.Id === order.Id) ? (
                  <OrderStatusTracker order={order} />
                ) : (
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-semibold text-gray-900 mb-1">
                          Order #{order.Id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(order.orderTime), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>

                    <div className="border-t border-b border-gray-100 py-3 my-3">
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ₹{item.itemTotal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{order.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span>₹{order.deliveryFee}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base border-t pt-2">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>
                        {order.deliveryAddress.label}: {order.deliveryAddress.street}
                      </span>
                    </div>

                    {order.status === "delivered" && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-1" />
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                          Rate Order
                        </Button>
                      </div>
                    )}
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;