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
  priceFrom: 0,
  priceTo: null,
  surfaceFrom: 15,
  surfaceTo: null,
  searchKeyword: "",
  geolocation: {
    lat: null,
    lng: null,
  },
  description: "",
  imageRemoved: false,
  isEdited: false,
  isMounted: false,
};

// get all listings
export const getListings = createAsyncThunk(
  "listings/get",
  async (url_data, thunkAPI) => {
    try {
      let type = url_data[0];
      let search_word = url_data[1];
      let city = url_data[2];
      let min_price = url_data[3];
      let max_price = url_data[4];
      let min_surface = url_data[5];
      let max_surface = url_data[6];
      console.log(url_data);
      let url = `/api/v1/listings?type=${type}`;

      if (city !== undefined && city !== "") {
        url = url + `&city=${city}`;
      }

      if (search_word !== "") {
        url = url + `&search=${search_word}`;
      }

      if (min_price !== null && min_price !== 0 && min_price !== "") {
        url = url + `&regularPrice[gte]=${min_price}`;
      }

      if (max_price !== null && max_price !== 0 && max_price !== "") {
        url = url + `&regularPrice[lte]=${max_price}`;
      }

      if (min_surface !== "" && min_surface !== null) {
        url = url + `&surface[gte]=${min_surface}`;
      }

      if (max_surface !== "" && max_surface !== null) {
        url = url + `&surface[lte]=${max_surface}`;
      }

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
  async ([lis_id, lis_data, img_inf], thunkAPI) => {
    try {
      const listingID = [lis_id, lis_data, img_inf][0];
      const listingAndImages = {
        listingData: [lis_id, lis_data, img_inf][1],
        imagesInfo: [lis_id, lis_data, img_inf][2],
      };
      const {
        data: { listing },
      } = await axiosAuth.put(`/api/v1/listings/${listingID}`, {
        listingAndImages,
      });
      return listing;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// remove listing image
export const removeListingImage = createAsyncThunk(
  "listings/removeListingImage",
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
    resetIsEdited: (state) => {
      state.isEdited = false;
    },
    resetImageRemoved: (state) => {
      state.imageRemoved = false;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setPriceFrom: (state, action) => {
      state.priceFrom = action.payload;
    },
    setPriceTo: (state, action) => {
      state.priceTo = action.payload;
    },
    setSurfaceFrom: (state, action) => {
      state.surfaceFrom = action.payload;
    },
    setSurfaceTo: (state, action) => {
      state.surfaceTo = action.payload;
    },
    resetListing: () => {
      return initialState;
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
        state.isMounted = false;
      })
      .addCase(getListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.listing = action.payload;
        state.imageRemoved = false;
        state.isMounted = true;
      })
      .addCase(getListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isMounted = true;
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
        state.loading = true;
        state.imageRemoved = false;
      })
      .addCase(removeListingImage.fulfilled, (state) => {
        state.imageRemoved = true;
        state.error = "";
        state.loading = false;
      })
      .addCase(removeListingImage.rejected, (state, action) => {
        state.loading = false;
        state.imageRemoved = false;
        state.error = action.payload;
      })
      .addCase(editListing.pending, (state) => {
        state.loading = true;
        state.isEdited = false;
      })
      .addCase(editListing.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.isEdited = true;
        state.listing = action.payload;
        toast.success("Listing updated successfully");
      })
      .addCase(editListing.rejected, (state, action) => {
        state.loading = false;
        state.isEdited = true;
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

export const {
  setGeolocation,
  setDescription,
  resetIsEdited,
  resetListing,
  resetImageRemoved,
  setSearchKeyword,
  setCity,
  setPriceFrom,
  setPriceTo,
  setSurfaceFrom,
  setSurfaceTo,
} = listingsSlice.actions;

export default listingsSlice.reducer;
