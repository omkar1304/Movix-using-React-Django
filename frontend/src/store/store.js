import { configureStore } from '@reduxjs/toolkit'
import HomeSlice from './HomeSlice'
import authSlice from './authSlice'
import userSlice from './userSlice'
import paymentSlice from './paymentSlice'


export const store = configureStore({
  reducer: {
    home : HomeSlice,
    auth : authSlice,
    user : userSlice,
    payment: paymentSlice,
  },
})