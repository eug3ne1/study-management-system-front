import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  role: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
        const { token, user, role } = action.payload;
      
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        state.role = role;
    
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ user, role }));
      },
      
      logout: (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.role = null;
        // Очищаємо localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
