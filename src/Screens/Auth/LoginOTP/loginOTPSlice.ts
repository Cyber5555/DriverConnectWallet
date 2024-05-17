import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';
import {useAuth} from '../../../Context/AuthContext';

interface LoginOTPData {
  phone: string;
  code: string;
}

interface LoginOTPPayload {
  status: boolean;
  code: string;
  message: string;
  token: string;
  errors?: {
    message: string;
  };
  user: {};
}

interface LoginOTPState {
  successCode: boolean;
  loading: boolean;
  error: {
    message: string;
  };
  message: string;
  token: string | null;
  user: any;
}

const initialState: LoginOTPState = {
  message: '',
  token: null,
  successCode: false,
  loading: false,
  error: {message: ''},
  user: {},
};

type RejectWithValue = {
  message: '';
};

export const loginOTPRequest = createAsyncThunk<LoginOTPPayload, LoginOTPData>(
  'loginOTP/loginOTPRequest',
  async ({phone, code}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}confirm_login_or_register`,
        headers,
        {phone: '+7' + phone, code},
      );
      return response.data;
    } catch (error: any) {
      if (error.response.data.message === 'Unauthenticated.') {
        const {loadUserData, logout} = useAuth();

        logout();
        loadUserData(true);
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const loginOTPSlice = createSlice({
  name: 'loginOTP',
  initialState,
  reducers: {
    clearError: state => {
      state.error.message = '';
      state.message = '';
      state.successCode = false;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginOTPRequest.pending, state => {
        state.loading = true;
        state.error.message = '';
        state.successCode = false;
        state.token = null;
      })
      .addCase(loginOTPRequest.fulfilled, (state, action) => {
        const {token, user} = action.payload;
        state.loading = false;
        state.token = token;
        state.successCode = true;
        state.user = user;
        state.error.message = '';
      })
      .addCase(loginOTPRequest.rejected, (state, action) => {
        const error = action.payload as RejectWithValue;
        state.loading = false;
        state.error.message = error.message;
        state.token = null;
        state.successCode = false;
      });
  },
});

export default loginOTPSlice.reducer;
export const {clearError} = loginOTPSlice.actions;
