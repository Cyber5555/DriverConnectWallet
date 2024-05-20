import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface GetBalanceHistoryData {
  token: string | null | undefined;
  current_page: number | null;
}

interface GetBalanceHistoryPayload {
  status: boolean;
  data: {
    data: any[];
    next_page_url: string | null;
  };
  message: string;
}

interface GetBalanceHistoryState {
  get_balance_history: any[];
  loading: boolean;
  current_page: number;
  next_page_url: string | null;
}

const initialState: GetBalanceHistoryState = {
  get_balance_history: [],
  loading: false,
  current_page: 1,
  next_page_url: null,
};

export const getBalanceHistoryRequest = createAsyncThunk<
  GetBalanceHistoryPayload,
  GetBalanceHistoryData
>(
  'get_balance_history/getBalanceHistoryRequest',
  async ({token, current_page}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_balance_history?page=${current_page}`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const getBalanceHistorySlice = createSlice({
  name: 'get_balance_history',
  initialState,
  reducers: {
    incrementCurrentPage: state => {
      state.current_page += 1;
    },
    clearData: state => {
      state.get_balance_history = [];
      state.current_page = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getBalanceHistoryRequest.pending, state => {
        state.loading = true;
      })
      .addCase(getBalanceHistoryRequest.fulfilled, (state, {payload}) => {
        const {data, next_page_url} = payload.data;
        state.next_page_url = next_page_url;
        if (next_page_url !== null) {
          state.get_balance_history = [...state.get_balance_history, ...data];
        }
        state.loading = false;
      })
      .addCase(getBalanceHistoryRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default getBalanceHistorySlice.reducer;
export const {clearData, incrementCurrentPage} = getBalanceHistorySlice.actions;
