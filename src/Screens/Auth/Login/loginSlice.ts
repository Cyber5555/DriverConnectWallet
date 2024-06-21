import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';

interface LoginData {
  phone: string;
}

export interface LoginPayload {
  status: boolean;
  code: string;
  message: string;
  errors?: {
    message: string;
  };
}

interface LoginState {
  loading: boolean;
  code: string;
  error: boolean | undefined;
  errorMessage: string;
}

const initialState: LoginState = {
  loading: false,
  code: '',
  error: false,
  errorMessage: '',
};

type RejectWithValue = {
  message: string;
  phone?: string[];
  status?: boolean;
  validation_error?: boolean;
};

export const loginRequest = createAsyncThunk<
  LoginPayload,
  LoginData,
  {
    rejectValue: RejectWithValue;
  }
>('login/loginRequest', async ({phone}, {rejectWithValue}: any) => {
  const headers = {
    'Content-type': 'application/json',
  };

  try {
    const response = await Http.post(
      `${process.env.API_URL}register_or_login`,
      headers,
      {phone: '+7' + phone},
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginRequest.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.code = '';
      })
      .addCase(loginRequest.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.code = payload.code;
      })
      .addCase(loginRequest.rejected, (state, {payload}) => {
        state.loading = false;
        const error = payload as RejectWithValue;
        state.code = '';
        if (error.message) {
          state.error = true;
          state.errorMessage = error?.message;
        }
        console.log('📢 [loginSlice.ts:84]', payload);
      });
  },
});

export default loginSlice.reducer;
