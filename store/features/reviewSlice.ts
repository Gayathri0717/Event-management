// store/features/reviewSlice.ts
import { createAsyncThunk,createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Review {
  id: string // unique review id
  eventId: string
  user: string
  rating: number // 1 to 5
  comment: string
  name:string
  date: string
  EventName:string
}

interface ReviewState {
  reviews: Review[]
}

const initialState: ReviewState = {
  reviews: [],
}
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (eventId: string) => {
    const res = await fetch(`/api/reviews/${eventId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();
    return data;
  }
);
 
export const postReview = createAsyncThunk(
  "reviews/postReview",
  async ({ eventId, user, rating, comment,EventName }: any, thunkAPI) => {
    const res = await fetch(`/api/reviews/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId, user, rating, comment,EventName }),
    });

    if (!res.ok) throw new Error("Failed to post review");

    const data = await res.json();
    return data;
  }
);
const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload)
    },
  },
    extraReducers: (builder) => {  // These handle special async actions (like API calls)
    builder.addCase(fetchReviews.fulfilled, (state, action) => { 
      // When fetchReviews finishes successfully...
      state.reviews = action.payload;  // Replace current reviews with fetched reviews
    });
    builder.addCase(postReview.fulfilled, (state, action) => {
      // When postReview finishes successfully...
      state.reviews.push(action.payload); // Add the new review to the list
    });
  },
})

export const { addReview } = reviewSlice.actions
export default reviewSlice.reducer
