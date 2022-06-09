import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  error: "",
  listings: null,
  listing: null,
  userListings: null,
  pages: 1,
  page: 1,
  pagination: null,
  userListings: null,
  geolocation: {
    lat: null,
    lng: null,
  },
  description: "",
  isLoded: false,
};

// get all listings
export const getListings = createAsyncThunk(
  "listings/get",
  async ([category], thunkAPI) => {
    try {
      let type = [category][0];
      let url = `/api/v1/listings?type=${type}`;

      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get single listing
export const getListing = createAsyncThunk(
  "listings/getSingleListing",
  async (id, thunkAPI) => {
    try {
      const {
        data: { listing },
      } = await axios.get(`/api/v1/listings/${id}`);

      return listing;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get user listings
export const getUserListings = createAsyncThunk(
  "listings/getUserListings",
  async (_, thunkAPI) => {
    try {
      const {
        data: { userListings },
      } = await axiosAuth.get(`/api/v1/listings/user`);

      return userListings;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// create listing & upload images for listing
export const createListing = createAsyncThunk(
  "listings/create",
  async ([fData, sData], thunkAPI) => {
    const listingData = [fData, sData][0];
    const imagesStrs = [fData, sData][1];
    try {
      const {
        data: { listing },
      } = await axiosAuth.post("/api/v1/listings", {
        listingData,
        imagesStrs,
      });
      return listing;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);
const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setGeolocation: (state, action) => {
      let lat = action.payload[0];
      let lng = action.payload[1];
      state.geolocation = {
        lat,
        lng,
      };
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListings.fulfilled, (state, action) => {
        const { count, data, page, pages, pagination } = action.payload;
        state.loading = false;
        state.error = "";
        state.listings = data;
      })
      .addCase(getListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listing = action.payload;
        toast.success("Listing created successfully");
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listing = action.payload;
      })
      .addCase(getListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserListings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserListings.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.userListings = action.payload;
      })
      .addCase(getUserListings.rejected, (state, action) => {
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

export const { setGeolocation, setDescription } = listingsSlice.actions;

export default listingsSlice.reducer;
