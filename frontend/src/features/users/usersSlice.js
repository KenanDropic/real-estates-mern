import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

const initialState = {
  user: null,
  token: tokenFromStorage,
  loading: false,
  error: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {},
});

export default usersSlice.reducer;
