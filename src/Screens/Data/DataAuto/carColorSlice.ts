import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User, useAuth} from '../../../Context/AuthContext';
import {Http} from '../../../../http';

interface CarColorData {
  authUser: User | null;
}

interface CarColorPayload {
  status: boolean;
  data: [];
}

interface CarColorState {
  car_color: [];
  loadingColors: boolean;
}

const initialState: CarColorState = {
  car_color: [],
  loadingColors: false,
};

export const carColorRequest = createAsyncThunk<CarColorPayload, CarColorData>(
  'carColor/carColorRequest',
  async ({authUser}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}car_color`,
        headers,
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

const carColorSlice = createSlice({
  name: 'carColor',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(carColorRequest.pending, state => {
        state.loadingColors = true;
      })
      .addCase(carColorRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.car_color = data;
        state.loadingColors = false;
      })
      .addCase(carColorRequest.rejected, state => {
        state.loadingColors = false;
      });
  },
});

export default carColorSlice.reducer;
