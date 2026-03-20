import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token: jwt, user: userData } = res.data;
      
      setToken(jwt);
      setUser(userData);
      localStorage.setItem('token', jwt);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Invalid credentials' };
    }
  };

  const requestRegisterOTP = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-register-otp', { email });
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Error requesting OTP' };
    }
  };

  const registerUser = async (name, email, password, otp) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, otp });
      const { token: jwt, user: userData } = res.data;
      
      setToken(jwt);
      setUser(userData);
      localStorage.setItem('token', jwt);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, requestRegisterOTP, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
