import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface AuthUserInfoData {
  token: string | null | undefined;
}

interface AuthUserInfoPayload {
  status: boolean;
  user: [];
  message: string;
}

interface AuthUserInfoState {
  auth_user_info: any;
  loading: boolean;
}

const initialState: AuthUserInfoState = {
  auth_user_info: null,
  loading: false,
};

export const authUserInfoRequest = createAsyncThunk<
  AuthUserInfoPayload,
  AuthUserInfoData
>(
  'authUserInfo/authUserInfoRequest',
  async ({token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}auth_user_info`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const authUserInfoSlice = createSlice({
  name: 'authUserInfo',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(authUserInfoRequest.pending, state => {
        state.loading = true;
      })
      .addCase(authUserInfoRequest.fulfilled, (state, action) => {
        const {user} = action.payload;
        state.auth_user_info = user;
        state.loading = false;
      })
      .addCase(authUserInfoRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default authUserInfoSlice.reducer;
