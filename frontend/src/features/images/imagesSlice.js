import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const initialState = {
  avatar: null,
  loading: false,
  error: "",
};

// upload image to cloudinary
export const upload = createAsyncThunk(
  "images/upload",
  async (data, thunkAPI) => {
    try {
      const img = axiosAuth.post("/api/v1/auth/upload", { data });

      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(upload.pending, (state) => {
        state.loading = true;
      })
      .addCase(upload.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // toast.success("Korisnik prijavljen uspješno");
      })
      .addCase(upload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// structure error message and return
const errorMessage = (error) => {
  const message =
    (error.response && error.response.data && error.response.data.error) ||
    error.message ||
    error.toString();

  return message;
};

export default imagesSlice.reducer;
