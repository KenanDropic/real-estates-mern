import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosAuth from "../../utils/axiosAuth";
import { toast } from "react-toastify";

const tokenFromStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

const initialState = {
  user: null,
  token: tokenFromStorage,
  loading: false,
  error: "",
};

// login user
export const login = createAsyncThunk(
  "users/login",
  async (credentials, thunkAPI) => {
    try {
      const {
        data: { token },
      } = await axios.post("/api/v1/auth/login", credentials);
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// register user
export const registerUser = createAsyncThunk(
  "users/register",
  async (credentials, thunkAPI) => {
    try {
      const {
        data: { token },
      } = await axios.post("/api/v1/auth/register", credentials);
      localStorage.setItem("token", token);

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// get current user
export const getCurrentUser = createAsyncThunk(
  "users/loggedUser",
  async (_, thunkAPI) => {
    try {
      const {
        data: { user },
      } = await axiosAuth.get("/api/v1/auth/me");
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// update user
export const updateUser = createAsyncThunk(
  "users/update",
  async (data, thunkAPI) => {
    try {
      const {
        data: { updatedUser },
      } = await axiosAuth.put("/api/v1/auth", data);
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

// upload user profile photo
export const upload = createAsyncThunk(
  "images/upload",
  async (data, thunkAPI) => {
    try {
      const {
        data: { image },
      } = await axiosAuth.post("/api/v1/auth/upload", { data });
      return image;
    } catch (error) {
      return thunkAPI.rejectWithValue(errorMessage(error));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      toast.success("User logout successfully");
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.token = action.payload;
        toast.success("User logged successfully");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.token = action.payload;
        toast.success("Registration successful");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
        toast.success("Profile updated successfully");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(upload.pending, (state) => {
        state.loading = true;
      })
      .addCase(upload.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user.avatar = action.payload;
        toast.success("Profile photo uploaded successfully");
      })
      .addCase(upload.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
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

export const { logout } = usersSlice.actions;

export default usersSlice.reducer;
