import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Http} from '../../../../http';
import {User, useAuth} from '../../../Context/AuthContext';

interface LoginOTPData {
  authUser: User | null;
}

interface LoginOTPPayload {
  status: boolean;
  data: [];
}

interface LoginOTPState {
  jobData: [];
}

const initialState: LoginOTPState = {
  jobData: [],
};

export const getJobCategoryRequest = createAsyncThunk<
  LoginOTPPayload,
  LoginOTPData
>(
  'getJobCategory/getJobCategoryRequest',
  async ({authUser}, {rejectWithValue}: any) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.get(
        `${process.env.API_URL}get_job_category`,
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

const getJobCategorySlice = createSlice({
  name: 'getJobCategory',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getJobCategoryRequest.fulfilled, (state, action) => {
      const {data} = action.payload;
      state.jobData = data;
    });
  },
});

export default getJobCategorySlice.reducer;
