import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User, useAuth} from '../../../Context/AuthContext';
import {Http} from '../../../../http';

interface GetCarMarksData {
  authUser: User | null;
}

interface GetCarMarksPayload {
  status: boolean;
  data: [];
}

interface GetCarMarksState {
  car_marks: [];
  loadingMarks: boolean;
}

const initialState: GetCarMarksState = {
  car_marks: [],
  loadingMarks: false,
};

export const getCarMarksRequest = createAsyncThunk<
  GetCarMarksPayload,
  GetCarMarksData
>(
  'getCarMarks/getCarMarksRequest',
  async ({authUser}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_car_marks`,
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

const getCarMarksSlice = createSlice({
  name: 'getCarMarks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCarMarksRequest.pending, state => {
        state.loadingMarks = true;
      })
      .addCase(getCarMarksRequest.fulfilled, (state, action) => {
        const {data} = action.payload;
        state.car_marks = data;
        state.loadingMarks = false;
      })
      .addCase(getCarMarksRequest.rejected, state => {
        state.loadingMarks = false;
      });
  },
});

export default getCarMarksSlice.reducer;
