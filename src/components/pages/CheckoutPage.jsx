import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { addressService } from "@/services/api/addressService";
import { orderService } from "@/services/api/orderService";
import { useCart } from "@/hooks/useCart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [error, setError] = useState("");

  const cartTotal = getCartTotal();
  const deliveryFee = 40;
  const total = cartTotal + deliveryFee;

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await addressService.getAll();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
      return;
    }
    loadAddresses();
  }, [cartItems.length, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setLoading(true);
      
      // Get restaurant ID from first cart item
      const restaurantId = cartItems[0]?.restaurantId;
      if (!restaurantId) {
        toast.error("Invalid cart data");
        return;
      }

      const orderData = {
        restaurantId,
        items: cartItems.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          selectedCustomizations: item.selectedCustomizations || {},
          specialInstructions: item.specialInstructions || "",
          itemTotal: item.itemTotal,
        })),
        deliveryAddress: selectedAddress,
        subtotal: cartTotal,
        deliveryFee,
        total,
      };

      const newOrder = await orderService.create(orderData);
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders`);
      
    } catch (err) {
      setError(err.message);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", icon: "Banknote" },
    { id: "card", label: "Credit/Debit Card", icon: "CreditCard" },
    { id: "upi", label: "UPI", icon: "Smartphone" },
    { id: "wallet", label: "Digital Wallet", icon: "Wallet" },
  ];

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-display font-bold text-gray-900">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-32 max-w-2xl mx-auto">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-4">
            <h2 className="font-display font-semibold text-gray-900 mb-3">
              Order Summary
            </h2>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.menuItemId} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary">
                    ₹{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-gray-900">
                Delivery Address
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/account")}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                Add New
              </Button>
            </div>

            {addressLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-3">No addresses found</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/account")}
                >
                  Add Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.Id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedAddress?.Id === address.Id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            checked={selectedAddress?.Id === address.Id}
                            onChange={() => setSelectedAddress(address)}
                            className="text-primary"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {address.label}
                            </h3>
                            {address.label === "Home" && (
                              <Badge variant="primary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-4">
            <h2 className="font-display font-semibold text-gray-900 mb-3">
              Payment Method
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="text-primary"
                    />
                    <ApperIcon name={method.icon} className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {method.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Error message={error} showRetry={false} />
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-gray-900">
              Total: ₹{total.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          
          <Button
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Placing Order...
              </>
            ) : (
              <>
                <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;