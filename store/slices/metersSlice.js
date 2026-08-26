import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const metersSlice = createSlice({
  name: "meters",
  initialState,
  reducers: {
    setMeters: (state, action) => {
      state.list = action.payload;
    },
    upsertMeter: (state, action) => {
      const meter = action.payload;
      const idx = state.list.findIndex((m) => m._id === meter._id);
      if (idx === -1) state.list.unshift(meter);
      else state.list[idx] = meter;
    },
    removeMeter: (state, action) => {
      state.list = state.list.filter((m) => m._id !== action.payload);
    },
    clearMeters: (state) => {
      state.list = [];
    },
  },
});

export const { setMeters, upsertMeter, removeMeter, clearMeters } = metersSlice.actions;
export default metersSlice.reducer;

export function getLastRecordedValue(meter) {
  const entries = meter.currentCycle.entries;
  return entries.length ? entries[entries.length - 1].reading : meter.currentCycle.baseline;
}

export function getCycleTotalUnits(meter) {
  const entries = meter.currentCycle.entries;
  if (!entries.length) return 0;
  return entries[entries.length - 1].reading - meter.currentCycle.baseline;
}