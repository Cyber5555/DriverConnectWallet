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
  error: boolean | undefined;
}

const initialState: LoginState = {
  loading: false,
  error: false,
};

// Define the type for rejectWithValue
type RejectWithValue = {
  message: {
    phone: [''];
    status: boolean;
    validation_error: boolean;
  };
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
      })
      .addCase(loginRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as RejectWithValue;
        if (error.message) {
          state.error = true;
        }
      });
  },
});

export default loginSlice.reducer;