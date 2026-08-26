import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  isOnboarded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload.name.trim();
      state.isOnboarded = state.name.length > 0;
    },
    resetUser: () => initialState,
  },
});

export const { setName, resetUser } = userSlice.actions;
export default userSlice.reducer;