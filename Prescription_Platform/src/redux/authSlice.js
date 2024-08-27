import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Or your preferred HTTP client

const initialState = {
  isLoggedIn: false,
  user: null,
  error: null,
  loading: false,
};

const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    try {
      console.log("credentials:", credentials);
      const response = await axios.post('http://localhost:5000/api/login', credentials);
  
      console.log("response", response);
      // Handle successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('user',JSON.stringify(response.data.user)); 
        localStorage.setItem('user_email',response.data.user.email); 
        return response.data; // Return the whole response data
      } else {
        return Promise.reject({ message: 'Invalid credentials' }); // Handle invalid credentials
      }
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  }
);


const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData) => {
    try {
      const { userType } = userData; // Assuming userType is present in userData
      const baseUrl = 'http://localhost:5000/api/'; // Replace with your actual backend endpoint base URL

      let url = `${baseUrl}doctor/signup`; // Default to doctor signup
      if (userType === 'patient') {
        url = `${baseUrl}patient/signup`; // Change to patient signup if userType is 'patient'
      }
      console.log("url:", url);
      console.log("userData:", userData);
      const response = await axios.post(url, userData);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload.message || 'Login failed';
        state.loading = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        // Handle successful signup, e.g., redirect to login page
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload.message || 'Signup failed';
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export { loginUser, signupUser };
