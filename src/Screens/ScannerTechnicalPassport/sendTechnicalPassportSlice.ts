import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';
import {User, useAuth} from '../../Context/AuthContext';

interface SendTechnicalPassportData {
  image1: string;
  image2: string;
  authUser: User | null;
}

export interface SendTechnicalPassportPayload {
  status: boolean;
  data: any;
  message: 'string';
}

interface SendTechnicalPassportState {
  technical_data: any;
  loading: boolean;
  error_message: string;
}

const initialState: SendTechnicalPassportState = {
  technical_data: {},
  loading: false,
  error_message: '',
};

export const sendTechnicalPassportRequest = createAsyncThunk<
  SendTechnicalPassportPayload,
  SendTechnicalPassportData
>(
  'sendTechnicalPassport/sendTechnicalPassportRequest',
  async ({image1, image2, authUser}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'multipart/form-data',
      Authorization: `Bearer ${authUser?.token}`,
    };

    const data = new FormData();

    data.append('car_license_front_photo', {
      uri: image1,
      name: image1.split('/').pop(),
      type: 'image/jpg',
    });
    data.append('car_license_back_photo', {
      uri: image2,
      name: image2.split('/').pop(),
      type: 'image/jpg',
    });
    try {
      const response = await Http.post(
        `${process.env.API_URL}upload_car_license`,
        headers,
        data,
      );
      return response.data;
    } catch (error: any) {
      if (error.response.data.message === 'Unauthenticated.') {
        const {loadUserData, logout} = useAuth();

        logout();
        loadUserData(false);
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const sendTechnicalPassportSlice = createSlice({
  name: 'sendTechnicalPassport',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendTechnicalPassportRequest.pending, state => {
        state.loading = true;
        state.error_message = '';
      })
      .addCase(sendTechnicalPassportRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.loading = false;
        state.technical_data = data;
        state.error_message = '';
      })
      .addCase(sendTechnicalPassportRequest.rejected, (state, {payload}) => {
        state.loading = false;
        const {message} = payload as SendTechnicalPassportPayload;
        state.error_message = message;
      });
  },
});

export default sendTechnicalPassportSlice.reducer;
