import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User, useAuth} from '../../../Context/AuthContext';
import {Http} from '../../../../http';

interface GetCarModelData {
  authUser: User | null;
  mark_id: string | number;
}

interface GetCarModelPayload {
  status: boolean;
  data: [];
}

interface GetCarModelState {
  car_model: [];
  loadingModels: boolean;
}

const initialState: GetCarModelState = {
  car_model: [],
  loadingModels: false,
};

export const getCarModelRequest = createAsyncThunk<
  GetCarModelPayload,
  GetCarModelData
>(
  'getCarModel/getCarModelRequest',
  async ({authUser, mark_id}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_car_model?mark_id=${mark_id}`,
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

const getCarModelSlice = createSlice({
  name: 'getCarModel',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCarModelRequest.pending, state => {
        state.loadingModels = true;
      })
      .addCase(getCarModelRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.car_model = data;
        state.loadingModels = false;
      })
      .addCase(getCarModelRequest.rejected, state => {
        state.loadingModels = false;
      });
  },
});

export default getCarModelSlice.reducer;
