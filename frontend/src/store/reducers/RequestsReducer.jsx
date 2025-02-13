import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  users:null,
};

export const RequestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: {
      reducer: (state, action) => {
        state.requests = action.payload;
      },
    },
    setUsers: {
      reducer: (state, action) => {
        state.users = action.payload;
      },
    }
  },
});

export const { setRequests, setUsers } = RequestsSlice.actions;


export default RequestsSlice.reducer;
