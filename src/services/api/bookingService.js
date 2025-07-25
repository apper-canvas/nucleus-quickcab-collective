// BookingService - handles all booking-related operations
import mockMonthlyBookings from "@/services/mockData/monthlyBookings.json";
import mockBookings from "@/services/mockData/bookings.json";
import Error from "@/components/ui/Error";

class BookingService {
  constructor() {
    this.bookings = [...mockBookings];
    this.monthlyBookings = [...mockMonthlyBookings];
  }

  // Mock driver data for assignment simulation
  getMockDriver() {
    return {
      id: "driver-1",
      name: "Alex Johnson", 
      photo: "/api/placeholder/64/64",
      rating: 4.8,
      totalRides: 1247,
      phone: "+1 (555) 123-4567",
      vehicle: {
        make: "Toyota",
        model: "Camry", 
        color: "Silver",
        licensePlate: "ABC-123"
      },
      eta: 3,
      distance: 0.8
    };
  }

  async getUpcomingBookings() {
    await this.delay(300);
    return [...this.bookings].filter(booking => 
      booking.status === "confirmed" || booking.status === "pending"
    );
  }

  async getMonthlyBookings() {
    await this.delay(300);
    return [...this.monthlyBookings];
  }

  async createBooking(bookingData) {
    await this.delay(500);
    
    const newBooking = {
      Id: this.getNextId(this.bookings),
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      driver: this.getMockDriver() // Assign driver when booking is created
    };
    
    this.bookings.push(newBooking);
    return { ...newBooking };
  }

async cancelBooking(bookingId, forceCancellation = false) {
    await this.delay(400);
    
    const bookingIndex = this.bookings.findIndex(b => b.Id === bookingId);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    const booking = this.bookings[bookingIndex];
    const cancellationFee = this.calculateCancellationFee(booking);
    
    // If there's a fee and it's not a forced cancellation, return fee info
    if (cancellationFee > 0 && !forceCancellation) {
      return {
        requiresConfirmation: true,
        cancellationFee: cancellationFee,
        booking: { ...booking }
      };
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancellationFee: cancellationFee
    };
    
    return { ...this.bookings[bookingIndex] };
  }

  calculateCancellationFee(booking) {
    const now = new Date();
    const bookingTime = new Date(booking.createdAt);
    const elapsedMinutes = Math.floor((now - bookingTime) / (1000 * 60));
    
    // Free cancellation within 15 minutes
    if (elapsedMinutes < 15) {
      return 0;
    }
    
    // $5 cancellation fee after 15 minutes
    return 5;
  }

  async modifyBooking(bookingId, modificationData) {
    await this.delay(400);
    
    const bookingIndex = this.bookings.findIndex(b => b.Id === bookingId);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...modificationData,
      modifiedAt: new Date().toISOString()
    };
    
    return { ...this.bookings[bookingIndex] };
  }

  async pauseMonthlyBooking(monthlyId) {
    await this.delay(300);
    
    const monthlyIndex = this.monthlyBookings.findIndex(m => m.Id === monthlyId);
    if (monthlyIndex === -1) {
      throw new Error("Monthly booking not found");
    }
    
    this.monthlyBookings[monthlyIndex] = {
      ...this.monthlyBookings[monthlyIndex],
      isActive: !this.monthlyBookings[monthlyIndex].isActive
    };
    
    return { ...this.monthlyBookings[monthlyIndex] };
  }
async createMonthlyBooking(monthlyData) {
    await this.delay(500);
    
    const newMonthly = {
      Id: this.getNextId(this.monthlyBookings),
      ...monthlyData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    this.monthlyBookings.push(newMonthly);
    return { ...newMonthly };
  }

  async modifyMonthlyBooking(monthlyId, modificationData) {
    await this.delay(400);
    
    const monthlyIndex = this.monthlyBookings.findIndex(m => m.Id === monthlyId);
    if (monthlyIndex === -1) {
      throw new Error("Monthly booking not found");
    }
    
    this.monthlyBookings[monthlyIndex] = {
      ...this.monthlyBookings[monthlyIndex],
      ...modificationData,
      modifiedAt: new Date().toISOString()
    };
    
    return { ...this.monthlyBookings[monthlyIndex] };
  }

getNextId(array) {
    return Math.max(...array.map(item => item.Id), 0) + 1;
  }
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const bookingService = new BookingService();