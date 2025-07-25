import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { paymentService } from '@/services/api/paymentService';
import { bookingService } from '@/services/api/bookingService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

function PaymentScreen({ 
  bookingData, 
  onPaymentComplete, 
  onBack,
  className 
}) {
const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [methodsLoaded, setMethodsLoaded] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fareBreakdown, setFareBreakdown] = useState(null);
  
  // Add card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

useEffect(() => {
    if (bookingData) {
      loadPaymentData();
    }
  }, [bookingData]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      setMethodsLoaded(false);
      
      const [methods, breakdown] = await Promise.all([
        paymentService.getPaymentMethods(),
        paymentService.calculateFare(bookingData)
      ]);
      
      console.log('Loaded payment methods:', methods); // Debug log
      
      if (methods && methods.length > 0) {
        setPaymentMethods(methods);
        setMethodsLoaded(true);
        
        // Auto-select default payment method
        const defaultMethod = methods.find(m => m.isDefault);
        if (defaultMethod) {
          setSelectedMethod(defaultMethod);
        } else {
          // If no default, select the first method
          setSelectedMethod(methods[0]);
        }
      } else {
        setPaymentMethods([]);
        setSelectedMethod(null);
        toast.info("No payment methods found. Please add a payment method.");
      }
      
      setFareBreakdown(breakdown);
      
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError(err.message || 'Failed to load payment information');
      toast.error('Failed to load payment methods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    
    try {
      const newMethod = await paymentService.addPaymentMethod(cardForm);
      setPaymentMethods(prev => [...prev, newMethod]);
      setSelectedMethod(newMethod);
      setShowAddCard(false);
      setCardForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
      toast.success('Payment method added successfully');
    } catch (err) {
      toast.error('Failed to add payment method: ' + err.message);
    }
  };

const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment
      const paymentData = {
        bookingId: bookingData.id,
        amount: fareBreakdown.total,
        paymentMethodId: selectedMethod.Id,
        type: 'ride',
        description: `Ride from ${bookingData.pickupLocation?.name || bookingData.pickupLocation} to ${bookingData.dropLocation?.name || bookingData.dropLocation}`
      };

      const paymentResult = await paymentService.processPayment(paymentData);

      // Create the actual booking after successful payment
      const finalBookingData = {
        ...bookingData,
        paymentId: paymentResult.Id,
        status: 'confirmed',
        totalFare: fareBreakdown.total
      };

      await bookingService.createBooking({
        pickupLocation: bookingData.pickupLocation?.name || bookingData.pickupLocation,
        dropLocation: bookingData.dropLocation?.name || bookingData.dropLocation,
        vehicleType: bookingData.vehicle?.name || bookingData.vehicleType,
        scheduledTime: new Date().toISOString(),
        estimatedFare: fareBreakdown.total,
        paymentId: paymentResult.Id
      });

      toast.success('Payment successful! Your ride has been booked.');
      onPaymentComplete?.(finalBookingData);

    } catch (error) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (number) => {
    return `**** **** **** ${number.slice(-4)}`;
  };

  const getCardIcon = (brand) => {
    const icons = {
      visa: 'CreditCard',
      mastercard: 'CreditCard', 
      amex: 'CreditCard',
      discover: 'CreditCard'
    };
    return icons[brand] || 'CreditCard';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPaymentData} />;

return (
    <div className={`w-full max-w-md mx-auto px-4 sm:px-0 pb-20 sm:pb-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6 relative z-50"
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              Payment
            </h1>
            <p className="text-sm text-gray-600">
              Complete your booking payment
            </p>
          </div>
        </div>

        {/* Booking Summary */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Trip Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="MapPin" size={16} className="text-accent-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Pickup</div>
                  <div className="font-medium text-gray-900">
                    {bookingData.pickupLocation?.name || bookingData.pickupLocation}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Flag" size={16} className="text-secondary-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Destination</div>
                  <div className="font-medium text-gray-900">
                    {bookingData.dropLocation?.name || bookingData.dropLocation}
                  </div>
                </div>
              </div>
            </div>

            {bookingData.vehicle && (
              <div className="bg-surface-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{bookingData.vehicle.name}</div>
                    <div className="text-sm text-gray-600">{bookingData.vehicle.description}</div>
                  </div>
                  <Badge variant="info" size="sm">
                    {bookingData.vehicle.eta} min
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Fare Breakdown */}
        {fareBreakdown && (
          <Card className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Fare Details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="text-gray-900">${fareBreakdown.baseFare.toFixed(2)}</span>
                </div>
                
                {fareBreakdown.serviceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="text-gray-900">${fareBreakdown.serviceFee.toFixed(2)}</span>
                  </div>
                )}
                
                {fareBreakdown.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">${fareBreakdown.tax.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${fareBreakdown.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Payment Methods */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddCard(true)}
                className="text-primary-600"
              >
                <ApperIcon name="Plus" size={16} className="mr-1" />
                Add Card
              </Button>
            </div>

<div className="space-y-2">
              {!methodsLoaded && loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading payment methods...</span>
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CreditCard" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No payment methods available</p>
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Add payment method functionality coming soon")}
                    className="text-sm"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <motion.div
                    key={method.Id}
                    onClick={() => setSelectedMethod(method)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedMethod?.Id === method.Id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-surface-200 hover:border-surface-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod?.Id === method.Id 
                          ? 'bg-primary-100' 
                          : 'bg-surface-100'
                      }`}>
                        <ApperIcon 
                          name={getCardIcon(method.brand)} 
                          size={20} 
                          className={selectedMethod?.Id === method.Id ? 'text-primary-600' : 'text-gray-600'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          selectedMethod?.Id === method.Id ? 'text-primary-900' : 'text-gray-900'
                        }`}>
                          {formatCardNumber(method.cardNumber)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.cardholderName} • {method.expiryDate}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <Badge variant="success" size="sm">Default</Badge>
                        )}
                        {selectedMethod?.Id === method.Id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-1 rounded-full bg-primary-600"
                          >
                            <ApperIcon name="Check" size={12} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Add Card Form */}
        {showAddCard && (
          <Card className="p-4">
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Add New Card</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddCard(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <Input
                label="Card Number"
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry Date"
                  value={cardForm.expiryDate}
                  onChange={(e) => setCardForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  required
                />
                <Input
                  label="CVV"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  required
                />
              </div>

              <Input
                label="Cardholder Name"
                value={cardForm.cardholderName}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                required
              />

              <div className="flex space-x-3">
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
          </Card>
        )}

        {/* Payment Button */}
<div className="space-y-3">
          <Button
            onClick={handlePayment}
            loading={isProcessing}
            disabled={!selectedMethod || isProcessing}
            className={`w-full transition-all duration-200 ${
              selectedMethod && !isProcessing
                ? 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
                : ''
            }`}
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : !selectedMethod ? (
              'Select Payment Method'
            ) : (
              `Pay $${fareBreakdown?.total.toFixed(2) || '0.00'}`
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By confirming payment, you agree to our terms and conditions
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentScreen;