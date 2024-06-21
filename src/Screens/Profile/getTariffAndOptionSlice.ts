import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface GetTariffAndOptionData {
  token: string | null | undefined;
}

interface GetTariffAndOptionPayload {
  status: boolean;
  get_options: any;
  get_tariffs: any;
  get_this_user_options: any;
  get_this_user_tariffs: any;
  message: string;
}

interface GetTariffAndOptionState {
  get_options: any[];
  get_tariffs: any[];
  get_this_user_options: any[];
  get_this_user_tariffs: any[];
  loading: boolean;
}

const initialState: GetTariffAndOptionState = {
  get_options: [],
  get_tariffs: [],
  get_this_user_options: [],
  get_this_user_tariffs: [],
  loading: false,
};

export const getTariffAndOptionRequest = createAsyncThunk<
  GetTariffAndOptionPayload,
  GetTariffAndOptionData
>(
  'get_tariff_and_option/getTariffAndOptionRequest',
  async ({token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_tariff_and_option`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const getTariffAndOptionSlice = createSlice({
  name: 'get_options',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getTariffAndOptionRequest.pending, state => {
        state.loading = true;
      })
      .addCase(getTariffAndOptionRequest.fulfilled, (state, {payload}) => {
        const {
          get_options,
          get_tariffs,
          get_this_user_options,
          get_this_user_tariffs,
        } = payload;
        state.get_options = get_options;
        state.get_tariffs = get_tariffs;
        state.get_this_user_options = get_this_user_options;
        state.get_this_user_tariffs = get_this_user_tariffs;
        state.loading = false;
      })
      .addCase(getTariffAndOptionRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default getTariffAndOptionSlice.reducer;
