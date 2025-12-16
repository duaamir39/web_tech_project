const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5298/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
    },
    EVENT: `${API_BASE_URL}/Event`,
    BOOKING: {
        CREATE: `${API_BASE_URL}/Booking`,
        MY_BOOKINGS: `${API_BASE_URL}/Booking/MyBookings`,
    },
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default API_BASE_URL;
