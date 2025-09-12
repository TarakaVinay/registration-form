import axios from "axios";

// Create a reusable axios instance
const api = axios.create({
    baseURL: "http://localhost:4000", // 👈 backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

const registrationService = {
    // Get All Registrations
    async getRegistrations() {
        const response = await api.get("/registration");
        return response.data;
    },

    // Get Registration by ID
    async getRegistrationById(id) {
        const response = await api.get(`/registration/${id}`);
        return response.data;
    },

    // Create Registration
    async createRegistration(registration) {
        const response = await api.post("/registration", registration);
        return response.data;
    },

    // Update Registration
    async updateRegistration(id, registration) {
        const response = await api.put(`/registration/${id}`, registration);
        return response.data; // updated registration object
    },

    // Delete Registration
    async deleteRegistration(id) {
        const response = await api.delete(`/registration/${id}`);
        return response.data;
    },
};

export default apiService;