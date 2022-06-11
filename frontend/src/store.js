import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/users/usersSlice";
import listingsReducer from "./features/listings/listingsSlice";
import imagesReducer from "./features/images/imagesSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    listings: listingsReducer,
    images: imagesReducer,
  },
});

export default store;
