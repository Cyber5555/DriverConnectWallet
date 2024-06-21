import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../http';

interface GetFAQData {
  token: string | null | undefined;
}

interface GetFAQPayload {
  status: boolean;
  data: any;
  message: string;
}

interface GetFAQState {
  get_faq: any[];
  loading: boolean;
}

const initialState: GetFAQState = {
  get_faq: [],
  loading: false,
};

export const getFAQRequest = createAsyncThunk<GetFAQPayload, GetFAQData>(
  'get_faq/getFAQRequest',
  async ({token}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_faqs`,
        headers,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const getFAQSlice = createSlice({
  name: 'get_faq',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFAQRequest.pending, state => {
        state.loading = true;
      })
      .addCase(getFAQRequest.fulfilled, (state, {payload}) => {
        const {data} = payload;

        state.get_faq = data;

        state.loading = false;
      })
      .addCase(getFAQRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default getFAQSlice.reducer;
