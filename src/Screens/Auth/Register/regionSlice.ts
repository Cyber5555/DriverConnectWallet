import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';
import {User} from '../../../Context/AuthContext';

interface RegionData {
  token: User | null;
}

interface RegionPayload {
  status: boolean;
  data: [];
}

interface RegionState {
  regionData: [];
}

const initialState: RegionState = {
  regionData: [],
};

export const regionRequest = createAsyncThunk<RegionPayload, RegionData>(
  'region/regionRequest',
  async ({token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_regions`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(regionRequest.fulfilled, (state, action) => {
      const {data} = action.payload;
      state.regionData = data;
    });
  },
});

export default regionSlice.reducer;
