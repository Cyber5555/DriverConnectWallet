import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';
import {useAuth} from '../../../Context/AuthContext';

export interface SocialDataPayload {
  status: boolean;
  data: {
    telegram: string;
    whatsapp: string;
  };
}

interface SocialDataState {
  loading: boolean;
  telegram: string;
  whatsApp: string;
}

const initialState: SocialDataState = {
  loading: false,
  telegram: '',
  whatsApp: '',
};

export const socialDataRequest = createAsyncThunk<SocialDataPayload>(
  'socialData/socialDataRequest',
  async (_, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_whatsapp_and_telegram`,
        headers,
      );

      return response.data;
    } catch (error: any) {
      if (error.response.data.message === 'Unauthenticated.') {
        const {loadUserData, logout} = useAuth();

        logout();
        loadUserData(true);
      }
      return rejectWithValue(error.response.data);
    }
  },
);

const socialDataSlice = createSlice({
  name: 'socialData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(socialDataRequest.pending, state => {
        state.loading = true;
      })
      .addCase(socialDataRequest.fulfilled, (state, action) => {
        state.loading = false;
        const {telegram, whatsapp} = action.payload.data;
        state.telegram = telegram;
        state.whatsApp = whatsapp;
      })
      .addCase(socialDataRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default socialDataSlice.reducer;
