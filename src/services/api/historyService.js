import mockHistory from "@/services/mockData/rideHistory.json";

class HistoryService {
  constructor() {
    this.rides = [...mockHistory];
  }

  async getRideHistory(period = "all") {
    await this.delay(300);
    
    let filteredRides = [...this.rides];
    
    if (period !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (period) {
        case "week":
          {
            filterDate.setDate(now.getDate() - 7);
            break;
          }
        case "month":
          {
            filterDate.setMonth(now.getMonth() - 1);
            break;
          }
        case "year":
          {
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
          }
        default:
          break;
      }
      
      filteredRides = filteredRides.filter(ride => 
        new Date(ride.completedAt) >= filterDate
      );
    }
    
    return filteredRides.sort((a, b) => 
      new Date(b.completedAt) - new Date(a.completedAt)
    );
  }

  async getRideById(rideId) {
    await this.delay(200);
    
    const ride = this.rides.find(r => r.Id === rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }
    
    return { ...ride };
  }

  async rebookRide(rideId) {
    await this.delay(400);
    
    const ride = this.rides.find(r => r.Id === rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }
    
    // In a real app, this would create a new booking
    const rebooking = {
      pickupLocation: ride.pickupLocation,
      dropLocation: ride.dropLocation,
      vehicleType: ride.vehicleType
    };
    
    return rebooking;
  }

  async downloadReceipt(rideId) {
    await this.delay(300);
    
    const ride = this.rides.find(r => r.Id === rideId);
    if (!ride) {
      throw new Error("Ride not found");
    }
    
    // In a real app, this would generate and download a PDF receipt
    return { success: true, message: "Receipt downloaded" };
  }

  async rateRide(rideId, rating, feedback = "") {
    await this.delay(300);
    
    const rideIndex = this.rides.findIndex(r => r.Id === rideId);
    if (rideIndex === -1) {
      throw new Error("Ride not found");
    }
    
    this.rides[rideIndex] = {
      ...this.rides[rideIndex],
      rating,
      feedback,
      ratedAt: new Date().toISOString()
    };
    
    return { ...this.rides[rideIndex] };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const historyService = new HistoryService();