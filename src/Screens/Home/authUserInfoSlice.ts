import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';
import {useAuth} from '../../Context/AuthContext';

interface AuthUserInfoData {
  token: string | null | undefined;
}

interface AuthUserInfoPayload {
  status: boolean;
  user: [];
  car: [];
  message: string;
  balance: number;
}

interface AuthUserInfoState {
  auth_user_info: any;
  loading: boolean;
  auth_user_car_info: any;
  balance: number;
}

const initialState: AuthUserInfoState = {
  auth_user_info: null,
  auth_user_car_info: null,
  loading: false,
  balance: 0,
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
      const {loadUserData, logout} = useAuth();

      logout();
      loadUserData(false);

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
      .addCase(authUserInfoRequest.fulfilled, (state, {payload}) => {
        const {user, car, balance} = payload;
        console.log('📢 [authUserInfoSlice.ts:71]', payload);
        state.auth_user_info = user;
        state.auth_user_car_info = car;
        state.balance = balance;
        state.loading = false;
      })
      .addCase(authUserInfoRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default authUserInfoSlice.reducer;
