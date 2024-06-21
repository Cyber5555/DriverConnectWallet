import {combineReducers, configureStore} from '@reduxjs/toolkit';
import loginSlice from '../Screens/Auth/Login/loginSlice';
import socialDataSlice from '../Screens/Auth/Login/socialDataSlice';
import loginOTPSlice from '../Screens/Auth/LoginOTP/loginOTPSlice';
import getJobCategorySlice from '../Screens/Auth/Register/getJobCategorySlice';
import regionSlice from '../Screens/Auth/Register/regionSlice';
import sendDriverLicenseSlice from '../Screens/ScannerDriverLicense/sendDriverLicenseSlice';
import sendTechnicalPassportSlice from '../Screens/ScannerTechnicalPassport/sendTechnicalPassportSlice';
import driverLicenseCountrySlice from '../Screens/ScannerDriverLicense/driverLicenseCountrySlice';
import createAccountSlice from '../Screens/Data/DataDriverLicense/createAccountSlice';
import getCarMarksSlice from '../Screens/Data/DataAuto/getCarMarksSlice';
import getCarModelSlice from '../Screens/Data/DataAuto/getCarModelSlice';
import carColorSlice from '../Screens/Data/DataAuto/carColorSlice';
import createNewCarSlice from '../Screens/Data/DataAuto/createNewCarSlice';
import authUserInfoSlice from '../Screens/Home/authUserInfoSlice';
import getBalanceHistorySlice from '../Screens/Home/getBalanceHistorySlice';
import getFAQSlice from '../Screens/Profile/getFAQSlice';
import getOrderHistorySlice from '../Screens/Trips/getOrderHistorySlice';
import getTariffAndOptionSlice from '../Screens/Profile/getTariffAndOptionSlice';
import updateTariffAndOptionsSlice from '../Screens/Profile/updateTariffAndOptionsSlice';
import updatePhoneSlice from '../Screens/Profile/updatePhoneSlice';
import updateOTPSlice from '../Screens/Profile/updateOTPSlice';

const rootReducer = combineReducers({
  loginSlice,
  socialDataSlice,
  loginOTPSlice,
  getJobCategorySlice,
  regionSlice,
  sendDriverLicenseSlice,
  sendTechnicalPassportSlice,
  driverLicenseCountrySlice,
  createAccountSlice,
  getCarMarksSlice,
  getCarModelSlice,
  carColorSlice,
  createNewCarSlice,
  authUserInfoSlice,
  getBalanceHistorySlice,
  getFAQSlice,
  getOrderHistorySlice,
  getTariffAndOptionSlice,
  updateTariffAndOptionsSlice,
  updatePhoneSlice,
  updateOTPSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
