import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  _id: string;
  name: "superAdmin" | "webMaster" | "user";
  permissions: string[];
}

interface UserState {
  id?: string;
  username?: string;
  email?: string;
  role?: Role;
  imgurl?: string;
  isAuthenticated?: boolean;
}

const initialState: UserState = {
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Omit<UserState, 'isAuthenticated'>>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    clearUser: (state) => {
      return { ...initialState };
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer; 