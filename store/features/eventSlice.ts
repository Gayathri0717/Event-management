import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EventType {
  id: string
  title: string
  location: string
  category: string
  date:string
  price: number
  description:string
  latitude:string
  longtitude:string
}

interface EventState {
  list: EventType[]
  boll: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: EventState = {
  list: [],
  boll:false,
  status: 'idle',
}

export const fetchEvents = createAsyncThunk(
  "Events/fetchEvents",
  async () => {
    const res = await fetch(`/api/Events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    const data = await res.json();
    return data;
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setbold: (state, action: PayloadAction<boolean>) => {
   state.boll=action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
  }
})

export default eventSlice.reducer
export const { setbold } = eventSlice.actions