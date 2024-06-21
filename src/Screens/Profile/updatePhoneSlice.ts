import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface UpdatePhoneData {
  phone: string | undefined;
  token: string | null | undefined;
}

export interface UpdatePhonePayload {
  payload: any;
  status: boolean;
  code: string;
  message: string;
  errors?: {
    message: string;
  };
}

interface UpdatePhoneState {
  loading: boolean;
  code: string;
  error: boolean | undefined;
  errorMessage: string;
}

const initialState: UpdatePhoneState = {
  loading: false,
  code: '',
  error: false,
  errorMessage: '',
};

// Define the type for rejectWithValue
type RejectWithValue = {
  message: {
    phone: [''];
    status: boolean;
    validation_error: boolean;
  };
};

export const updatePhoneRequest = createAsyncThunk<
  UpdatePhonePayload,
  UpdatePhoneData,
  {
    rejectValue: RejectWithValue;
  }
>(
  'update_phone/updatePhoneRequest',
  async ({phone, token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}update_phone`,
        headers,
        {phone: '+7' + phone},
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const updatePhoneSlice = createSlice({
  name: 'update_phone',
  initialState,
  reducers: {
    clearError: state => {
      state.error = false;
      state.errorMessage = '';
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updatePhoneRequest.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.code = '';
      })
      .addCase(updatePhoneRequest.fulfilled, (state, {payload}) => {
        state.loading = false;
        state.code = payload.code;
      })
      .addCase(updatePhoneRequest.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as RejectWithValue;
        state.code = '';
        console.log('📢 [updatePhoneSlice.ts:92]', error.message.phone);
        if (error.message) {
          state.error = true;
          state.errorMessage = error.message.phone[0];
        }
      });
  },
});

export default updatePhoneSlice.reducer;
export const {clearError} = updatePhoneSlice.actions;
