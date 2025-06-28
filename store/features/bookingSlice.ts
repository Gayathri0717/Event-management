import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { CartItem } from './cartSlice'

export interface BookingState {
  history: CartItem[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: BookingState = {
  history: [],
  status: 'idle',
}
export const postBookings = createAsyncThunk(
  "bookings/postBookings",
  async ({ items, userEmail,userName }: { items: CartItem[]; userEmail: string | null | undefined ; userName:string | null | undefined}) => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, userEmail,userName }),
    })
    if (!response.ok) {
      throw new Error('Failed to send booking')
    }

    const data = await response.json()
    return data
  }
);
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (userEmail:string) => {
    const res = await fetch(`/api/bookings?userEmail=${userEmail}`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    const data = await res.json();
    return data;
  }
);
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    
  },
extraReducers: (builder) => {
  builder
    // FETCH bookings
    .addCase(fetchBookings.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(fetchBookings.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.history = action.payload
    })

    // POST bookings
    .addCase(postBookings.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(postBookings.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.history.push(action.payload) 
    });
}

})

export const { } = bookingSlice.actions
export default bookingSlice.reducer
