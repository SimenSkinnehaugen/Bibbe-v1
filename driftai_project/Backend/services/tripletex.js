const axios = require('axios');

class TripletexService {
  constructor(sessionToken) {
    this.sessionToken = sessionToken;
    this.baseURL = 'https://api.tripletex.no/v2';
  }

  async makeRequest(endpoint, params = {}) {
    const response = await axios.get(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`0:${this.sessionToken}`).toString('base64')}`
      },
      params
    });
    return response.data;
  }

  async getAccounts() {
    return this.makeRequest('/ledger/account', { count: 1000 });
  }

  async getTransactions(fromDate, toDate) {
    return this.makeRequest('/ledger/voucher', {
      dateFrom: fromDate,
      dateTo: toDate,
      count: 1000
    });
  }

  async getCustomers() {
    return this.makeRequest('/customer', { count: 1000 });
  }

  async getSuppliers() {
    return this.makeRequest('/supplier', { count: 1000 });
  }
}

module.exports = TripletexService;
