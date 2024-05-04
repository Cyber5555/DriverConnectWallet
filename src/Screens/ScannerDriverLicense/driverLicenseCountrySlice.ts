import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {Http} from '../../../http';
import {User} from '../../Context/AuthContext';

interface DriverLicenseCountryData {
  token: User | null;
}

interface DriverLicenseCountryPayload {
  status: boolean;
  data: [];
}

interface DriverLicenseCountryState {
  driverLicenseCountryData: [];
}

const initialState: DriverLicenseCountryState = {
  driverLicenseCountryData: [],
};

export const driverLicenseCountryRequest = createAsyncThunk<
  DriverLicenseCountryPayload,
  DriverLicenseCountryData
>(
  'driverLicenseCountry/driverLicenseCountryRequest',
  async ({token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_drive_license_country`,
        headers,
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response);
    }
  },
);

const driverLicenseCountrySlice = createSlice({
  name: 'driverLicenseCountry',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(driverLicenseCountryRequest.fulfilled, (state, action) => {
      const {data} = action.payload;
      state.driverLicenseCountryData = data;
    });
  },
});

export default driverLicenseCountrySlice.reducer;
