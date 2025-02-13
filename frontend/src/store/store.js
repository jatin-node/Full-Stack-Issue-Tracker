import { configureStore } from '@reduxjs/toolkit'
import requestsReducer from "../store/reducers/RequestsReducer";

export const store = configureStore({
  reducer: {
    requestsReducer: requestsReducer,
  },
})