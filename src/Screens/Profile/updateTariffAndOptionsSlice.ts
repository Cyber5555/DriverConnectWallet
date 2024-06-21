import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface UpdateTariffAndOptionsData {
  token: string | null | undefined;
  updated: {options: string[]; tariffs: string[]};
}

interface UpdateTariffAndOptionsPayload {
  status: boolean;
  message: string;
}

interface UpdateTariffAndOptionsState {
  loading: boolean;
}

const initialState: UpdateTariffAndOptionsState = {
  loading: false,
};

export const updateTariffAndOptionsRequest = createAsyncThunk<
  UpdateTariffAndOptionsPayload,
  UpdateTariffAndOptionsData
>(
  'update_tariff_and_option/updateTariffAndOptionsRequest',
  async ({token, updated}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}update_tariff_and_option`,
        headers,
        updated,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const updateTariffAndOptionsSlice = createSlice({
  name: 'update_tariff_and_option',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(updateTariffAndOptionsRequest.pending, state => {
        state.loading = true;
      })
      .addCase(updateTariffAndOptionsRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(updateTariffAndOptionsRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default updateTariffAndOptionsSlice.reducer;
