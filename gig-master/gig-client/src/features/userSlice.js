import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserInfo,updateUserInfo,uploadProfileImage } from "../api/user";

const initialState = {
 user:{}
};

export const getUserinfoAsync = createAsyncThunk(
  "user/info",
  async (id) => {
    const response = await getUserInfo(id);
    return response;
  }
);

export const updateUserDetailsAsync = createAsyncThunk(
  'user/updateUserInfo',
  async ({ userId, userDetails }) => {
    const response = await updateUserInfo(userId, userDetails);
    return response;
  }
);

export const uploadProfileImageAsync = createAsyncThunk(
  'user/uploadProfileImage',
  async ({ userId, imageFile }) => {
    const response = await uploadProfileImage(userId, imageFile);
    return response;
  }
);



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // logout(state) {
    //   state.isLoggedIn = false;
    //   state.userId = null;
    //   state.accessToken = null;
    //   state.roles = [];
    // },
    // clearMessages(state) {
    //   state.msg = '';
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserinfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserinfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
    
      .addCase(getUserinfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserDetailsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserDetailsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserDetailsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(uploadProfileImageAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadProfileImageAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.user.profileImage = action.payload.profileImage;
      })
      .addCase(uploadProfileImageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
