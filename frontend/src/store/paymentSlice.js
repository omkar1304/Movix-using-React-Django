import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: null,
  isDone: null,
}

export const PaymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayment: (state, action) => {
      state.email = action.payload.email
      state.isDone = action.payload.isDone
    },
    unsetPayment: (state) => {
      state.email = ""
      state.name = ""
    },
  }
})

export const { setPayment, unsetPayment } = PaymentSlice.actions

export default PaymentSlice.reducer