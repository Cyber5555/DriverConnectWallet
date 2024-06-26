import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';
import {User, useAuth} from '../../../Context/AuthContext';

interface CreateNewCarData {
  callsign: string;
  licence_plate_number: string;
  // registration_certificate: string;
  mark_name: string;
  model_name: string;
  year: number;
  vin: string;
  color_name: string;
  authUser: User | null;
  car_license_front_photo: string | undefined;
  car_license_back_photo: string | undefined;
}

export interface CreateNewCarPayload {
  status: boolean;
  data: any;
  yandex_error?: {
    message: string;
  };
}

interface CreateNewCarState {
  technical_data: any;
  loading: boolean;
}

const initialState: CreateNewCarState = {
  technical_data: {},
  loading: false,
};

export const createNewCarRequest = createAsyncThunk<
  CreateNewCarPayload,
  CreateNewCarData
>(
  'createNewCar/createNewCarRequest',
  async (
    {
      authUser,
      callsign,
      color_name,
      licence_plate_number,
      mark_name,
      model_name,
      vin,
      year,
      car_license_back_photo,
      car_license_front_photo,
    },
    {rejectWithValue}: any,
  ) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}create_new_car`,
        headers,
        {
          callsign,
          color_name,
          licence_plate_number,
          mark_name,
          model_name,
          vin,
          year,
          car_license_back_photo,
          car_license_front_photo,
        },
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

const createNewCarSlice = createSlice({
  name: 'createNewCar',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createNewCarRequest.pending, state => {
        state.loading = true;
      })
      .addCase(createNewCarRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.technical_data = data;
        state.loading = false;
      })
      .addCase(createNewCarRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default createNewCarSlice.reducer;
