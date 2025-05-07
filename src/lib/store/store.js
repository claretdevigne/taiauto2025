import { create } from 'zustand'

export const Store = create((set) => ({
  hotelInfo: null,
  setHotelInfo: (payload) => set({ hotelInfo: payload }),
}))