import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EventType } from './eventSlice'

export interface CartItem extends EventType {
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cartItems')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(items))
  }
}

const initialState: CartState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<EventType>) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      saveCartToStorage(state.items)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      saveCartToStorage(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
