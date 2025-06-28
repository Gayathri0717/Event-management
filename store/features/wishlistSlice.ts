// store/features/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventType } from './eventSlice';

interface WishlistState {
  items: EventType[];
}

const loadWishlist = (): EventType[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveWishlist = (items: EventType[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<EventType>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      saveWishlist(state.items);
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
