import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import LocationPicker from "@/components/molecules/LocationPicker";
import VehicleCard from "@/components/molecules/VehicleCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import PaymentScreen from "@/components/pages/PaymentScreen";

const BookingFlow = ({ onBookingComplete, className = "" }) => {
const [currentStep, setCurrentStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const vehicles = [
    {
      id: 1,
      name: "QuickEco",
      type: "economy",
      description: "Affordable rides for everyday travel",
      price: 12.50,
      originalPrice: 15.00,
      eta: 3,
      capacity: 4,
      isPopular: true
    },
    {
      id: 2,
      name: "QuickComfort",
      type: "premium",
      description: "Premium comfort with extra space",
      price: 18.00,
      eta: 5,
      capacity: 4
    },
    {
      id: 3,
      name: "QuickXL",
      type: "suv",
      description: "Spacious rides for groups",
      price: 25.00,
      eta: 7,
      capacity: 6
    }
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && (!pickupLocation || !dropLocation)) {
      toast.error("Please select both pickup and drop locations");
      return;
    }
    if (currentStep === 2 && !selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

const handleBookRide = async () => {
    setIsBooking(true);
    
    try {
      // Prepare comprehensive booking data for payment
      const booking = {
        id: Date.now(),
        pickupLocation,
        dropLocation,
        vehicle: selectedVehicle,
        estimatedArrival: new Date(Date.now() + selectedVehicle.eta * 60000),
        fare: selectedVehicle.price,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
        // Additional data for payment processing
        distance: "5.2 km", // Mock distance
        duration: `${selectedVehicle.eta} min`
      };
      
      console.log('Preparing booking data for payment:', booking); // Debug log
      
      setBookingData(booking);
      setCurrentStep(4); // Move to payment step
      toast.success("Booking details confirmed! Please complete payment.");
      
    } catch (error) {
      console.error('Booking preparation error:', error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentComplete = (finalBookingData) => {
    onBookingComplete?.(finalBookingData);
    resetBooking();
  };

  const handlePaymentBack = () => {
    setCurrentStep(3);
    setBookingData(null);
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setPickupLocation(null);
    setDropLocation(null);
    setSelectedVehicle(null);
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };
return (
    <div className={`w-full max-w-md mx-auto px-4 sm:px-0 pb-safe ${className}`}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <div className="flex items-center space-x-4">
{[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
                step < currentStep 
                  ? "bg-accent-500 text-white" 
                  : step === currentStep
                  ? "bg-primary-500 text-white"
                  : "bg-surface-200 text-gray-500"
              }`}>
                {step < currentStep ? <ApperIcon name="Check" size={16} /> : step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-0.5 mx-2 transition-all duration-200 ${
                  step < currentStep ? "bg-accent-500" : "bg-surface-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
{/* Step Content */}
      <div className="relative min-h-[400px] max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-160px)] md:h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="locations"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
className="absolute inset-0"
            >
              <Card className="p-4 sm:p-6 h-full overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <ApperIcon name="MapPin" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    Where to?
                  </h2>
                </div>

                <div className="space-y-4">
                  <LocationPicker
                    type="pickup"
                    value={pickupLocation}
                    onLocationSelect={setPickupLocation}
                  />
                  
                  <div className="flex justify-center">
                    <button className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center hover:bg-surface-200 transition-colors">
                      <ApperIcon name="ArrowUpDown" size={20} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <LocationPicker
                    type="destination"
                    value={dropLocation}
                    onLocationSelect={setDropLocation}
                  />
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleNextStep}
                    className="w-full"
                    disabled={!pickupLocation || !dropLocation}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="vehicles"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Card className="p-4 sm:p-6 h-full overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <ApperIcon name="Car" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    Choose Vehicle
                  </h2>
                </div>

                <div className="space-y-3">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      selected={selectedVehicle?.id === vehicle.id}
                      onSelect={setSelectedVehicle}
                    />
                  ))}
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="flex-1"
                    disabled={!selectedVehicle}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

{currentStep === 3 && (
            <motion.div
              key="confirm"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
className="absolute inset-0"
            >
              <Card className="p-4 sm:p-6 h-full overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <ApperIcon name="CheckCircle" size={24} className="text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900 font-display">
                    Confirm Booking
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Trip Summary */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="MapPin" size={16} className="text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Pickup</div>
                        <div className="font-medium text-gray-900">{pickupLocation?.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Flag" size={16} className="text-secondary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Destination</div>
                        <div className="font-medium text-gray-900">{dropLocation?.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  {selectedVehicle && (
                    <div className="bg-surface-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{selectedVehicle.name}</div>
                          <div className="text-sm text-gray-600">{selectedVehicle.description}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="info" size="sm">
                              {selectedVehicle.eta} min
                            </Badge>
                            <Badge variant="default" size="sm">
                              {selectedVehicle.capacity} seats
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${selectedVehicle.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                      disabled={isBooking}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleBookRide}
                      loading={isBooking}
                      className="flex-1"
                    >
                      {isBooking ? "Preparing..." : "Continue to Payment"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && bookingData && (
            <motion.div
              key="payment"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <PaymentScreen
                bookingData={bookingData}
                onPaymentComplete={handlePaymentComplete}
                onBack={handlePaymentBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingFlow;