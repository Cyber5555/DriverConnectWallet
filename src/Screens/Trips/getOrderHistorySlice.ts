// /api/get_order_history

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface GetOrderHistoryData {
  token: string | null | undefined;
  current_page: number | null;
}

interface GetOrderHistoryPayload {
  status: boolean;
  data: {
    data: any[];
    next_page_url: string | null;
  };
  charter: any[];
  message: string;
}

interface GetOrderHistoryState {
  get_order_history: any[];
  charter: any[];
  loading: boolean;
  current_page: number;
  next_page_url: string | null;
}

const initialState: GetOrderHistoryState = {
  get_order_history: [],
  loading: false,
  current_page: 1,
  next_page_url: null,
  charter: [],
};

export const getOrderHistoryRequest = createAsyncThunk<
  GetOrderHistoryPayload,
  GetOrderHistoryData
>(
  'get_order_history/getOrderHistoryRequest',
  async ({token, current_page}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_order_history?page=${current_page}`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const getOrderHistorySlice = createSlice({
  name: 'get_order_history',
  initialState,
  reducers: {
    incrementCurrentPage: state => {
      state.current_page += 1;
    },
    clearData: state => {
      state.get_order_history = [];
      state.current_page = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOrderHistoryRequest.pending, state => {
        state.loading = true;
      })
      .addCase(getOrderHistoryRequest.fulfilled, (state, {payload}) => {
        const {charter, data} = payload;
        state.next_page_url = data.next_page_url;
        state.charter = charter;
        if (data.next_page_url !== null) {
          state.get_order_history = [...state.get_order_history, ...data.data];
        }

        state.loading = false;
      })
      .addCase(getOrderHistoryRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default getOrderHistorySlice.reducer;
export const {clearData, incrementCurrentPage} = getOrderHistorySlice.actions;
