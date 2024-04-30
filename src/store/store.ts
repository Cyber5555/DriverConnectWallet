import {combineReducers, configureStore} from '@reduxjs/toolkit';
import loginSlice from '../Screens/Auth/Login/loginSlice';
import loginOTPSlice from '../Screens/Auth/LoginOTP/loginOTPSlice';
import getJobCategorySlice from '../Screens/Auth/Register/getJobCategorySlice';
import regionSlice from '../Screens/Auth/Register/regionSlice';

const rootReducer = combineReducers({
  loginSlice,
  loginOTPSlice,
  getJobCategorySlice,
  regionSlice,
});

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
