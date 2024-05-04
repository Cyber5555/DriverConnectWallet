import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User} from '../../../Context/AuthContext';
import {Http} from '../../../../http';

interface GetCarModelData {
  token: User | null;
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
  async ({token, mark_id}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_car_model?mark_id=${mark_id}`,
        headers,
      );
      return response.data;
    } catch (error: any) {
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
