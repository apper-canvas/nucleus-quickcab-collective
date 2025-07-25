import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { historyService } from "@/services/api/historyService";

const HistoryPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    loadHistory();
  }, [selectedPeriod]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await historyService.getRideHistory(selectedPeriod);
      setRides(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRebook = async (ride) => {
    try {
      await historyService.rebookRide(ride.Id);
      toast.success("Ride rebooked successfully!");
    } catch (err) {
      toast.error("Failed to rebook ride");
    }
  };

  const handleDownloadReceipt = async (rideId) => {
    try {
      await historyService.downloadReceipt(rideId);
      toast.success("Receipt downloaded!");
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      completed: { variant: "success", label: "Completed" },
      cancelled: { variant: "danger", label: "Cancelled" },
      no_show: { variant: "warning", label: "No Show" }
    };
    
    const statusConfig = config[status] || { variant: "default", label: status };
    return <Badge variant={statusConfig.variant} size="sm">{statusConfig.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalSpent = () => {
    return rides.reduce((total, ride) => total + ride.finalFare, 0);
  };

  const periods = [
    { id: "all", label: "All Time" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" }
  ];

  if (loading) return <Loading type="bookings" />;
  if (error) return <Error message={error} onRetry={loadHistory} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">Ride History</h1>
            <p className="text-sm text-gray-600">Your completed trips and receipts</p>
          </div>
          {rides.length > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${getTotalSpent().toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total spent</div>
            </div>
          )}
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white border-b border-surface-200 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedPeriod === period.id
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {rides.length === 0 ? (
          <Empty 
            type="history" 
            onAction={() => {}} 
            actionLabel="Take Your First Ride"
          />
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <motion.div
                key={ride.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="slide-up"
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Trip #{ride.Id}
                        </h3>
                        {getStatusBadge(ride.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(ride.completedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${ride.finalFare.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">{ride.vehicleType}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mt-0.5">
                        <ApperIcon name="MapPin" size={12} className="text-accent-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-500">From</div>
                        <div className="font-medium text-gray-900 truncate">
                          {ride.pickupLocation}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center mt-0.5">
                        <ApperIcon name="Flag" size={12} className="text-secondary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-500">To</div>
                        <div className="font-medium text-gray-900 truncate">
                          {ride.dropLocation}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 py-3 bg-surface-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {ride.distance.toFixed(1)} km
                      </div>
                      <div className="text-xs text-gray-500">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatDuration(ride.duration)}
                      </div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <ApperIcon name="Star" size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">
                          {ride.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-surface-50 rounded-lg">
                    <img
                      src={ride.driver.photo || "/api/placeholder/40/40"}
                      alt={ride.driver.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {ride.driver.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {ride.driver.vehicle} • {ride.driver.licensePlate}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Repeat"
                      onClick={() => handleRebook(ride)}
                      className="flex-1"
                    >
                      Rebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Download"
                      onClick={() => handleDownloadReceipt(ride.Id)}
                      className="flex-1"
                    >
                      Receipt
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;