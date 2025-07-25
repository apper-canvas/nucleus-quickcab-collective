import mockPaymentMethods from "@/services/mockData/paymentMethods.json";
import mockTransactions from "@/services/mockData/transactions.json";

class PaymentService {
  constructor() {
    this.paymentMethods = [...mockPaymentMethods];
    this.transactions = [...mockTransactions];
  }

  async getPaymentMethods() {
    await this.delay(300);
    return [...this.paymentMethods];
  }

  async getTransactions() {
    await this.delay(300);
    return [...this.transactions].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  async addPaymentMethod(cardData) {
    await this.delay(500);
    
    const newMethod = {
      Id: this.getNextId(this.paymentMethods),
      cardNumber: cardData.cardNumber,
      expiryDate: cardData.expiryDate,
      cardholderName: cardData.cardholderName,
      brand: this.detectCardBrand(cardData.cardNumber),
      isDefault: this.paymentMethods.length === 0,
      createdAt: new Date().toISOString()
    };
    
    this.paymentMethods.push(newMethod);
    return { ...newMethod };
  }

  async removePaymentMethod(methodId) {
    await this.delay(300);
    
    const methodIndex = this.paymentMethods.findIndex(m => m.Id === methodId);
    if (methodIndex === -1) {
      throw new Error("Payment method not found");
    }
    
    const removedMethod = this.paymentMethods[methodIndex];
    this.paymentMethods.splice(methodIndex, 1);
    
    // If we removed the default method, set another as default
    if (removedMethod.isDefault && this.paymentMethods.length > 0) {
      this.paymentMethods[0].isDefault = true;
    }
    
    return { success: true };
  }

  async setDefaultPaymentMethod(methodId) {
    await this.delay(300);
    
    const method = this.paymentMethods.find(m => m.Id === methodId);
    if (!method) {
      throw new Error("Payment method not found");
    }
    
    // Remove default from all methods
    this.paymentMethods.forEach(m => m.isDefault = false);
    
    // Set new default
    method.isDefault = true;
    
    return { ...method };
  }

  async processPayment(paymentData) {
    await this.delay(800);
    
    const transaction = {
      Id: this.getNextId(this.transactions),
      ...paymentData,
      status: "completed",
      timestamp: new Date().toISOString()
    };
    
    this.transactions.push(transaction);
    return { ...transaction };
  }

  async refundPayment(transactionId, amount) {
    await this.delay(600);
    
    const originalTransaction = this.transactions.find(t => t.Id === transactionId);
    if (!originalTransaction) {
      throw new Error("Transaction not found");
    }
    
    const refund = {
      Id: this.getNextId(this.transactions),
      type: "refund",
      amount: amount,
      description: `Refund for transaction #${transactionId}`,
      status: "completed",
      timestamp: new Date().toISOString(),
      paymentMethod: originalTransaction.paymentMethod
    };
    
    this.transactions.push(refund);
    return { ...refund };
  }

  detectCardBrand(cardNumber) {
    const number = cardNumber.replace(/\s/g, "");
    
    if (number.startsWith("4")) return "visa";
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard";
    if (number.startsWith("3")) return "amex";
    if (number.startsWith("6")) return "discover";
    
    return "unknown";
  }

  getNextId(array) {
    return Math.max(...array.map(item => item.Id), 0) + 1;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const paymentService = new PaymentService();