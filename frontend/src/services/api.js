const API_BASE_URL = 'http://localhost:5000/api/auth';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Auth API calls
export const authAPI = {
  doctorLogin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/doctor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  patientLogin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  doctorSignup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/doctor/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  patientSignup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/patient/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }
};

// Appointments API calls
export const appointmentsAPI = {
  // Patient endpoints
  getMyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  createAppointment: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(response);
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(response);
  },

  deleteAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Doctor endpoints
  getAllAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/all`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateAppointmentByDoctor: async (id, appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/doctor/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(response);
  }
};

// Medical History API calls
export const medicalHistoryAPI = {
  createMedicalHistory: async (historyData) => {
    const response = await fetch(`${API_BASE_URL}/medical-history`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(historyData)
    });
    return handleResponse(response);
  },

  getMyMedicalHistories: async () => {
    const response = await fetch(`${API_BASE_URL}/medical-history`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getMedicalHistoryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medical-history/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateMedicalHistory: async (id, historyData) => {
    const response = await fetch(`${API_BASE_URL}/medical-history/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(historyData)
    });
    return handleResponse(response);
  }
};

export default {
  authAPI,
  appointmentsAPI,
  medicalHistoryAPI
};