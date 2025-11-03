import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addressService } from "@/services/api/addressService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const AccountPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "Bangalore",
    pincode: "",
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await addressService.getAll();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddAddress = async () => {
    try {
      if (!newAddress.label || !newAddress.street || !newAddress.pincode) {
        return;
      }
      
      const addressData = {
        ...newAddress,
        coordinates: { lat: 12.9716, lng: 77.5946 }
      };
      
      await addressService.create(addressData);
      setNewAddress({ label: "", street: "", city: "Bangalore", pincode: "" });
      setShowAddAddress(false);
      loadAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressService.delete(id);
      loadAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRetry = () => {
    loadAddresses();
  };

  const accountSections = [
    {
      title: "Orders",
      items: [
        { label: "Your Orders", icon: "Package", action: () => window.location.href = "/orders" },
        { label: "Favorites", icon: "Heart", action: () => {} },
      ]
    },
    {
      title: "Account",
      items: [
        { label: "Profile Settings", icon: "User", action: () => {} },
        { label: "Payment Methods", icon: "CreditCard", action: () => {} },
        { label: "Notifications", icon: "Bell", action: () => {} },
      ]
    },
    {
      title: "Support",
      items: [
        { label: "Help Center", icon: "HelpCircle", action: () => {} },
        { label: "Contact Support", icon: "MessageCircle", action: () => {} },
        { label: "Rate the App", icon: "Star", action: () => {} },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">
                Guest User
              </h1>
              <p className="text-gray-600">
                Manage your account and preferences
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delivery Addresses Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-gray-900">
            Delivery Addresses
          </h2>
          <Button
            size="sm"
            onClick={() => setShowAddAddress(!showAddAddress)}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
            Add Address
          </Button>
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Add New Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label
                  </label>
                  <Input
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="Home, Office, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <Input
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddAddress}>
                  Save Address
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Addresses List */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={handleRetry} />
        ) : addresses.length === 0 ? (
          <Empty
            title="No addresses saved"
            message="Add your delivery addresses for faster checkout"
            actionLabel="Add Address"
            onAction={() => setShowAddAddress(true)}
            icon="MapPin"
          />
        ) : (
          <div className="space-y-3 mb-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="MapPin" className="w-5 h-5 text-primary" />
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
                    
                    <button
                      onClick={() => handleDeleteAddress(address.Id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Account Sections */}
        <div className="space-y-6 pb-20">
          {accountSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + sectionIndex * 0.1 }}
            >
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <Card className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <ApperIcon name={item.icon} className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;