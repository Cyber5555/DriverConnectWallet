import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface UpdateOTPData {
  phone: string;
  code: string;
  token: string | null | undefined;
}

interface UpdateOTPPayload {
  status: boolean;
  code: string;
  message: string;
  errors?: {
    message: string;
  };
}

interface UpdateOTPState {
  successCode: boolean;
  loading: boolean;
  error: {
    message: string;
    status: boolean;
  };
  message: string;
}

const initialState: UpdateOTPState = {
  message: '',
  successCode: false,
  loading: false,
  error: {message: '', status: false},
};

type RejectWithValue = {
  message: '';
  status: boolean;
};

export const updateOTPRequest = createAsyncThunk<
  UpdateOTPPayload,
  UpdateOTPData
>(
  'updateOTP/updateOTPRequest',
  async ({phone, code, token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}confirm_new_phone_code`,
        headers,
        {phone: '+7' + phone, code},
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const updateOTPSlice = createSlice({
  name: 'updateOTP',
  initialState,
  reducers: {
    clearError: state => {
      state.error.message = '';
      state.error.status = false;
      state.message = '';
      state.successCode = false;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateOTPRequest.pending, state => {
        state.loading = true;
        state.error.message = '';
        state.error.status = false;
        state.successCode = false;
      })
      .addCase(updateOTPRequest.fulfilled, state => {
        state.loading = false;
        state.successCode = true;

        state.error.message = '';
        state.error.status = false;
      })
      .addCase(updateOTPRequest.rejected, (state, action) => {
        const error = action.payload as RejectWithValue;
        state.loading = false;
        state.error.message = error.message;
        state.error.status = true;
        state.successCode = false;
      });
  },
});

export default updateOTPSlice.reducer;
export const {clearError} = updateOTPSlice.actions;
