import { configureStore } from '@reduxjs/toolkit'
import eventReducer from './features/eventSlice'
import cartReducer from './features/cartSlice'
import filterReducer from './features/filterSlice'
import bookingReducer from './features/bookingSlice'
import wishlistReducer from './features/wishlistSlice';
import reviewreducer from './features/reviewSlice';
export const store = configureStore({
  reducer: {
    events: eventReducer,
    cart: cartReducer,
    filter: filterReducer,
    booking: bookingReducer,
    wishlist: wishlistReducer,
    review: reviewreducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
