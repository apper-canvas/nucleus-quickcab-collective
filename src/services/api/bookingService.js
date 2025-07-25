import React from "react";
import mockMonthlyBookings from "@/services/mockData/monthlyBookings.json";
import mockBookings from "@/services/mockData/bookings.json";
import Error from "@/components/ui/Error";

class BookingService {
  constructor() {
    this.bookings = [...mockBookings];
    this.monthlyBookings = [...mockMonthlyBookings];
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
      createdAt: new Date().toISOString()
    };
    
    this.bookings.push(newBooking);
    return { ...newBooking };
  }

async cancelBooking(bookingId) {
    await this.delay(400);
    
    const bookingIndex = this.bookings.findIndex(b => b.Id === bookingId);
    if (bookingIndex === -1) {
      throw new Error("Booking not found");
    }
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      status: "cancelled",
      cancelledAt: new Date().toISOString()
    };
    
    return { ...this.bookings[bookingIndex] };
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