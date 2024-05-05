import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';
import {User} from '../../Context/AuthContext';

interface SendTechnicalPassportData {
  image1: string;
  image2: string;
  authUser: User | null;
}

export interface SendTechnicalPassportPayload {
  status: boolean;
  data: any;
}

interface SendTechnicalPassportState {
  technical_data: any;
  loading: boolean;
}

const initialState: SendTechnicalPassportState = {
  technical_data: {},
  loading: false,
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
      })
      .addCase(sendTechnicalPassportRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.loading = false;
        state.technical_data = data;
      })
      .addCase(sendTechnicalPassportRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default sendTechnicalPassportSlice.reducer;
