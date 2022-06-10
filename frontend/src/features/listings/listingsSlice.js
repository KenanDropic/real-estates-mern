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
  geolocation: {
    lat: null,
    lng: null,
  },
  description: "",
  isFinished: false,
  imageRemoved: false,
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

// edit listing
export const editListing = createAsyncThunk(
  "listings/edit",
  async ([id, listingData], thunkAPI) => {
    try {
      const listingID = [id, listingData][0];
      const listData = [id, listingData][1];
      // const {
      //   data: { listing },
      // } =
      await axiosAuth.put(`/api/v1/listings/${listingID}`, {
        listData,
      });
      // return listing;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// remove listing image
export const removeListingImage = createAsyncThunk(
  "listings/edit",
  async ([listingId, imageId], thunkAPI) => {
    try {
      const listing_id = [listingId, imageId][0];
      const image_id = [listingId, imageId][1];
      await axiosAuth.delete(
        `/api/v1/listings/${listing_id}/images/${image_id}`
      );
      return;
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
      state.geolocation = {
        lat: action.payload[0],
        lng: action.payload[1],
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
        // eslint-disable-next-line
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
        state.isFinished = false;
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listing = action.payload;
        state.isFinished = true;
      })
      .addCase(getListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFinished = true;
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
      })
      .addCase(removeListingImage.pending, (state) => {
        state.isFinished = false;
        state.imageRemoved = false;
      })
      .addCase(removeListingImage.fulfilled, (state) => {
        state.isFinished = true;
        state.imageRemoved = true;
        state.error = "";
      })
      .addCase(removeListingImage.rejected, (state, action) => {
        state.isFinished = true;
        state.imageRemoved = true;
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
