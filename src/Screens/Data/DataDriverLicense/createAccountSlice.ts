import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User} from '../../../Context/AuthContext';
import {Http} from '../../../../http';

interface CreateAccountData {
  authUser: User | null;
  job_category_id?: string | undefined;
  region_id?: string | undefined;
  birth_date?: Date | string | undefined;
  country_id?: string | undefined;
  driver_license_expiry_date?: string | null;
  driver_license_issue_date?: string | null;
  driver_license_number?: string;
  driver_license_experience_total_since_date?: number;
  person_full_name_first_name?: string | undefined;
  scanning_person_full_name_first_name?: string | undefined;
  person_full_name_last_name?: string | undefined;
  scanning_person_full_name_last_name?: string;
  person_full_name_middle_name?: string | undefined;
  scanning_person_full_name_middle_name?: string | undefined;
}

export interface CreateAccountPayload {
  status: boolean;
  data: any;
}

interface CreateAccountState {
  loading: boolean;
}

const initialState: CreateAccountState = {
  loading: false,
};

export const createAccountRequest = createAsyncThunk<
  CreateAccountPayload,
  CreateAccountData
>(
  'createAccount/createAccountRequest',
  async (
    {
      authUser,
      birth_date,
      country_id,
      driver_license_experience_total_since_date,
      driver_license_expiry_date,
      driver_license_issue_date,
      driver_license_number,
      job_category_id,
      person_full_name_first_name,
      person_full_name_last_name,
      person_full_name_middle_name,
      region_id,
      scanning_person_full_name_first_name,
      scanning_person_full_name_last_name,
      scanning_person_full_name_middle_name,
    },
    {rejectWithValue}: any,
  ) => {
    const headers = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${authUser?.token}`,
    };

    try {
      const response = await Http.post(
        `${process.env.API_URL}create_account`,
        headers,
        {
          birth_date,
          country_id,
          driver_license_experience_total_since_date,
          driver_license_expiry_date,
          driver_license_issue_date,
          driver_license_number,
          job_category_id,
          person_full_name_first_name,
          person_full_name_last_name,
          person_full_name_middle_name,
          region_id,
          scanning_person_full_name_first_name,
          scanning_person_full_name_last_name,
          scanning_person_full_name_middle_name,
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const createAccountSlice = createSlice({
  name: 'createAccount',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createAccountRequest.pending, state => {
        state.loading = true;
      })
      .addCase(createAccountRequest.fulfilled, state => {
        state.loading = false;
      })
      .addCase(createAccountRequest.rejected, state => {
        state.loading = false;
      });
  },
});

export default createAccountSlice.reducer;
