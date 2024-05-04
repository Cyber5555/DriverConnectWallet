import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';
import {User} from '../../Context/AuthContext';

interface SendDriverLicenseData {
  image1: string;
  image2: string;
  token: User | null;
}

export interface SendDriverLicensePayload {
  status: boolean;
  data: any;
}

interface SendDriverLicenseState {
  driver_license_issue_date: Date | undefined;
  driver_license_expiry_date: Date | undefined;
  driver_license_number: string;
  scanning_person_full_name_first_name: string;
  scanning_person_full_name_last_name: string;
  scanning_person_full_name_middle_name: string;
  loading: boolean;
}

const initialState: SendDriverLicenseState = {
  loading: false,
  driver_license_issue_date: undefined,
  driver_license_expiry_date: undefined,
  driver_license_number: '',
  scanning_person_full_name_first_name: '',
  scanning_person_full_name_last_name: '',
  scanning_person_full_name_middle_name: '',
};

export const sendDriverLicenseRequest = createAsyncThunk<
  SendDriverLicensePayload,
  SendDriverLicenseData
>(
  'sendDriverLicense/sendDriverLicenseRequest',
  async ({image1, image2, token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'multipart/form-data',
      Authorization: `Bearer ${token?.token}`,
    };

    const data = new FormData();

    data.append('driver_license_front_photo', {
      uri: image1,
      name: image1.split('/').pop(),
      type: 'image/jpg',
    });
    data.append('driver_license_back_photo', {
      uri: image2,
      name: image2.split('/').pop(),
      type: 'image/jpg',
    });
    try {
      const response = await Http.post(
        `${process.env.API_URL}upload_photo_driver_license`,
        headers,
        data,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const sendDriverLicenseSlice = createSlice({
  name: 'sendDriverLicense',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(sendDriverLicenseRequest.pending, state => {
        state.loading = true;
      })
      .addCase(sendDriverLicenseRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.loading = false;

        if ('driver_license_expiry_date' in data) {
          state.driver_license_expiry_date = new Date(
            data.driver_license_expiry_date,
          );
        }

        if ('driver_license_issue_date' in data) {
          state.driver_license_issue_date = new Date(
            data.driver_license_issue_date,
          );
        }

        if ('scanning_person_full_name_first_name' in data) {
          state.scanning_person_full_name_first_name =
            data.scanning_person_full_name_first_name;
        }
        if ('scanning_person_full_name_last_name' in data) {
          state.scanning_person_full_name_last_name =
            data.scanning_person_full_name_last_name;
        }
        if ('scanning_person_full_name_middle_name' in data) {
          state.scanning_person_full_name_middle_name =
            data.scanning_person_full_name_middle_name;
        }

        if ('driver_license_number' in data) {
          state.driver_license_number = data.driver_license_number;
        }
      })
      .addCase(sendDriverLicenseRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default sendDriverLicenseSlice.reducer;
