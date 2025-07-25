import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { paymentService } from "@/services/api/paymentService";

const PaymentsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [activeTab, setActiveTab] = useState("methods");
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [methodsData, transactionsData] = await Promise.all([
        paymentService.getPaymentMethods(),
        paymentService.getTransactions()
      ]);
      
      setPaymentMethods(methodsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    
    try {
      await paymentService.addPaymentMethod(newCard);
      toast.success("Payment method added successfully!");
      setShowAddCard(false);
      setNewCard({ cardNumber: "", expiryDate: "", cvv: "", cardholderName: "" });
      loadPaymentData();
    } catch (err) {
      toast.error("Failed to add payment method");
    }
  };

  const handleRemoveCard = async (cardId) => {
    try {
      await paymentService.removePaymentMethod(cardId);
      toast.success("Payment method removed");
      loadPaymentData();
    } catch (err) {
      toast.error("Failed to remove payment method");
    }
  };

  const handleSetDefault = async (cardId) => {
    try {
      await paymentService.setDefaultPaymentMethod(cardId);
      toast.success("Default payment method updated");
      loadPaymentData();
    } catch (err) {
      toast.error("Failed to update default payment method");
    }
  };

  const getCardIcon = (brand) => {
    const icons = {
      visa: "CreditCard",
      mastercard: "CreditCard",
      amex: "CreditCard",
      discover: "CreditCard"
    };
    return icons[brand.toLowerCase()] || "CreditCard";
  };

  const getCardColor = (brand) => {
    const colors = {
      visa: "text-blue-600",
      mastercard: "text-red-600",
      amex: "text-green-600",
      discover: "text-orange-600"
    };
    return colors[brand.toLowerCase()] || "text-gray-600";
  };

  const getTransactionIcon = (type) => {
    const icons = {
      ride: "Car",
      refund: "ArrowUp",
      cancellation: "X",
      monthly: "Repeat"
    };
    return icons[type] || "DollarSign";
  };

  const getTransactionColor = (type) => {
    const colors = {
      ride: "text-blue-600",
      refund: "text-green-600",
      cancellation: "text-red-600",
      monthly: "text-purple-600"
    };
    return colors[type] || "text-gray-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCardNumber = (number) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  if (loading) return <Loading type="bookings" />;
  if (error) return <Error message={error} onRetry={loadPaymentData} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">Payments</h1>
            <p className="text-sm text-gray-600">Manage payment methods and transactions</p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddCard(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700"
          >
            Add Card
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-surface-200 px-4">
        <div className="flex space-x-1">
          {[
            { id: "methods", label: "Payment Methods", icon: "CreditCard" },
            { id: "transactions", label: "Transactions", icon: "Receipt" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "methods" && (
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <Empty 
                type="payments" 
                onAction={() => setShowAddCard(true)} 
                actionLabel="Add Payment Method"
              />
            ) : (
              paymentMethods.map((method) => (
                <motion.div
                  key={method.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="slide-up"
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center`}>
                          <ApperIcon 
                            name={getCardIcon(method.brand)} 
                            size={24} 
                            className={getCardColor(method.brand)} 
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {method.brand}
                            </h3>
                            {method.isDefault && (
                              <Badge variant="primary" size="sm">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatCardNumber(method.cardNumber)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Expires {method.expiryDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.Id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleRemoveCard(method.Id)}
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <Empty 
                type="history" 
                onAction={() => {}} 
                actionLabel="Take Your First Ride"
              />
            ) : (
              transactions.map((transaction) => (
                <motion.div
                  key={transaction.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="slide-up"
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center`}>
                          <ApperIcon 
                            name={getTransactionIcon(transaction.type)} 
                            size={20} 
                            className={getTransactionColor(transaction.type)} 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(transaction.timestamp)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.paymentMethod}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          transaction.type === "refund" ? "text-green-600" : "text-gray-900"
                        }`}>
                          {transaction.type === "refund" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <Badge 
                          variant={transaction.status === "completed" ? "success" : "warning"} 
                          size="sm"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add Payment Method</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={() => setShowAddCard(false)}
              />
            </div>
            
            <form onSubmit={handleAddCard} className="space-y-4">
              <Input
                label="Cardholder Name"
                value={newCard.cardholderName}
                onChange={(e) => setNewCard(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                required
              />
              
              <Input
                label="Card Number"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  required
                />
                
                <Input
                  label="CVV"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Add Card
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentsPage;