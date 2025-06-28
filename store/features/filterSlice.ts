import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FilterState {
  category: string
  location: string
}

const initialState: FilterState = {
  category: '',
  location: '',
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
    clearFilters: (state) => {
      state.category = ''
      state.location = ''
    },
  },
})

export const { setCategory, setLocation, clearFilters } = filterSlice.actions
export default filterSlice.reducer
