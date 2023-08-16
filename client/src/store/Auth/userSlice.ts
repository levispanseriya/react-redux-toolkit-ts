import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { signIn, login, forgotPassword, resetPassword } from "./userActions";

interface State {
  entities: [];
  loading: "idle" | "pending" | "succeeded" | "failed";
}
const initialState = {
  status: "idle",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [signIn.pending]: (state) => {
      state.status = "loading";
    },
    [signIn.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.customers = action.payload;
    },
    [signIn.rejected]: (state: any, action: any) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default AuthSlice.reducer;
