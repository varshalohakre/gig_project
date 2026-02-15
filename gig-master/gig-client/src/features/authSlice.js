import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { googleSignin, login, logout, register } from "../api/auth";

const initialState = {
  isLoggedIn: false,
  userId: null,
  accessToken: null,
  loading: false,
  error: null,
  msg: null,
  roles: []
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    const response = await login(credentials);
    return response;
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (credentials) => {
    const response = await register(credentials);
    return response;
  }
);

export const googleloginAsync = createAsyncThunk(
  "auth/login/user",
  async (res) => {
    const response = await googleSignin(res);
    return response;
  }
);

export const logoutAsync = createAsyncThunk("auth/logout/user", async () => {
  const response = await logout();
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.accessToken = null;
      state.roles = [];
    },
    clearMessages(state) {
      state.msg = '';
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleloginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userId = action.payload.userId;
        state.roles = action.payload.roles;
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.msg = action.payload.message;
        // console.log(action.error.message);
        state.error= null
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        // state.msg = action.payload.message;
        console.log(action);
        state.error= action.error.message
      })
      .addCase(googleloginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userId = action.payload.userId;
        state.roles = action.payload.roles;
      })
      .addCase(googleloginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
        state.error = action.error.message;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.userId = null;
        state.accessToken = null;
        state.roles = [];
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserId = (state) => state.auth.userId;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthMessage = (state) => state.auth.msg;
export const selectAuthRoles = (state) => state.auth.roles;
export const { clearMessages,clearError } = authSlice.actions;

export default authSlice.reducer;
