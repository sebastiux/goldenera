import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paymentAPI = {
  getPrograms: async () => {
    const response = await api.get("/api/payment/programs");
    return response.data;
  },
  
  createPaymentIntent: async (programId: string) => {
    const response = await api.post("/api/payment/create-payment-intent", {
      programId,
    });
    return response.data;
  },
};

export default api;
