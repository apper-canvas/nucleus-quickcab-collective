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
import { bookingService } from "@/services/api/bookingService";

const BookingsPage = () => {
const [bookings, setBookings] = useState([]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingMonthlyId, setEditingMonthlyId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [upcomingData, monthlyData] = await Promise.all([
        bookingService.getUpcomingBookings(),
        bookingService.getMonthlyBookings()
      ]);
      
      setBookings(upcomingData);
      setMonthlyBookings(monthlyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

const handlePauseMonthly = async (monthlyId) => {
    try {
      await bookingService.pauseMonthlyBooking(monthlyId);
      toast.success("Monthly booking paused");
      loadBookings();
    } catch (err) {
      toast.error("Failed to pause monthly booking");
    }
  };

const handleEditBooking = (booking) => {
    setEditingBookingId(booking.Id);
    setEditFormData({
      pickupLocation: booking.pickupLocation,
      dropLocation: booking.dropLocation,
      scheduledTime: new Date(booking.scheduledTime).toISOString().slice(0, 16),
      vehicleType: booking.vehicleType
    });
  };

  const handleEditMonthly = (monthly) => {
    setEditingMonthlyId(monthly.Id);
    setEditFormData({
      title: monthly.title,
      pickupLocation: monthly.pickupLocation,
      dropLocation: monthly.dropLocation,
      schedule: monthly.schedule,
      frequency: monthly.frequency
    });
  };

  const handleSaveBooking = async (bookingId) => {
    try {
      const modificationData = {
        ...editFormData,
        scheduledTime: new Date(editFormData.scheduledTime).toISOString()
      };
      await bookingService.modifyBooking(bookingId, modificationData);
      toast.success("Booking updated successfully");
      setEditingBookingId(null);
      setEditFormData({});
      loadBookings();
    } catch (err) {
      toast.error("Failed to update booking");
    }
  };

  const handleSaveMonthly = async (monthlyId) => {
    try {
      await bookingService.modifyMonthlyBooking(monthlyId, editFormData);
      toast.success("Monthly booking updated successfully");
      setEditingMonthlyId(null);
      setEditFormData({});
      loadBookings();
    } catch (err) {
      toast.error("Failed to update monthly booking");
    }
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
    setEditingMonthlyId(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { variant: "success", label: "Confirmed" },
      pending: { variant: "warning", label: "Pending" },
      cancelled: { variant: "danger", label: "Cancelled" },
      completed: { variant: "info", label: "Completed" }
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

  if (loading) return <Loading type="bookings" />;
  if (error) return <Error message={error} onRetry={loadBookings} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">My Bookings</h1>
            <p className="text-sm text-gray-600">Manage your rides and schedules</p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            className="bg-gradient-to-r from-primary-600 to-primary-700"
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-surface-200 px-4">
        <div className="flex space-x-1">
          {[
            { id: "upcoming", label: "Upcoming", icon: "Calendar" },
            { id: "monthly", label: "Monthly", icon: "Repeat" }
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
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <Empty 
                type="bookings" 
                onAction={() => {}} 
                actionLabel="Book a Ride"
              />
            ) : (
              bookings.map((booking) => (
                <motion.div
                  key={booking.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="slide-up"
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Booking #{booking.Id}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(booking.scheduledTime)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${booking.estimatedFare.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">{booking.vehicleType}</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mt-0.5">
                          <ApperIcon name="MapPin" size={12} className="text-accent-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-500">Pickup</div>
                          <div className="font-medium text-gray-900 truncate">
                            {booking.pickupLocation}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center mt-0.5">
                          <ApperIcon name="Flag" size={12} className="text-secondary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-500">Destination</div>
                          <div className="font-medium text-gray-900 truncate">
                            {booking.dropLocation}
                          </div>
                        </div>
                      </div>
                    </div>

{editingBookingId === booking.Id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pickup Location
                            </label>
                            <input
                              type="text"
                              value={editFormData.pickupLocation || ''}
                              onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter pickup location"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Drop Location
                            </label>
                            <input
                              type="text"
                              value={editFormData.dropLocation || ''}
                              onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter drop location"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Scheduled Time
                            </label>
                            <input
                              type="datetime-local"
                              value={editFormData.scheduledTime || ''}
                              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Type
                            </label>
                            <select
                              value={editFormData.vehicleType || ''}
                              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="QuickEco">QuickEco</option>
                              <option value="QuickComfort">QuickComfort</option>
                              <option value="QuickXL">QuickXL</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon="Check"
                            onClick={() => handleSaveBooking(booking.Id)}
                            className="flex-1"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="X"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEditBooking(booking)}
                          className="flex-1"
                        >
                          Modify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon="X"
                          onClick={() => handleCancelBooking(booking.Id)}
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "monthly" && (
          <div className="space-y-4">
            {monthlyBookings.length === 0 ? (
              <Empty 
                type="monthly" 
                onAction={() => {}} 
                actionLabel="Setup Monthly Booking"
              />
            ) : (
              monthlyBookings.map((monthly) => (
                <motion.div
                  key={monthly.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="slide-up"
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {monthly.title}
                          </h3>
                          <Badge 
                            variant={monthly.isActive ? "success" : "default"} 
                            size="sm"
                          >
                            {monthly.isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {monthly.schedule} • {monthly.frequency}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ${monthly.monthlyRate.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">per month</div>
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
                            {monthly.pickupLocation}
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
                            {monthly.dropLocation}
                          </div>
                        </div>
                      </div>
                    </div>

{editingMonthlyId === monthly.Id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editFormData.title || ''}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter booking title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pickup Location
                            </label>
                            <input
                              type="text"
                              value={editFormData.pickupLocation || ''}
                              onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter pickup location"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Drop Location
                            </label>
                            <input
                              type="text"
                              value={editFormData.dropLocation || ''}
                              onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter drop location"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Schedule
                            </label>
                            <input
                              type="text"
                              value={editFormData.schedule || ''}
                              onChange={(e) => handleInputChange('schedule', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="e.g., Mon-Fri 8:00 AM"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequency
                            </label>
                            <select
                              value={editFormData.frequency || ''}
                              onChange={(e) => handleInputChange('frequency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-weekly">Bi-weekly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon="Check"
                            onClick={() => handleSaveMonthly(monthly.Id)}
                            className="flex-1"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon="X"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEditMonthly(monthly)}
                          className="flex-1"
                        >
                          Edit Schedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={monthly.isActive ? "Pause" : "Play"}
                          onClick={() => handlePauseMonthly(monthly.Id)}
                          className="flex-1"
                        >
                          {monthly.isActive ? "Pause" : "Resume"}
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;