import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const AUTHORIZATION_STORAGE_KEY = "sugar.authorization";

export type RegistrationCredentials = {
  login: string;
  password: string;
};

export type RecoveryCredentials = {
  hash: string | null;
  login: string;
};

type AuthState = {
  isAuthenticated: boolean;
  registrationCredentials: RegistrationCredentials | null;
  recoveryCredentials: RecoveryCredentials | null;
};

export const readStoredAuthorization = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(AUTHORIZATION_STORAGE_KEY);

export const persistAuth = (authorization: string | null) => {
  if (typeof window === "undefined") return;

  if (authorization) {
    window.localStorage.setItem(AUTHORIZATION_STORAGE_KEY, authorization);
    return;
  }

  window.localStorage.removeItem(AUTHORIZATION_STORAGE_KEY);
};

const initialState: AuthState = {
  isAuthenticated: Boolean(readStoredAuthorization()),
  registrationCredentials: null,
  recoveryCredentials: null,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    clearRegistrationCredentials: (state) => {
      state.registrationCredentials = null;
    },
    clearRecoveryCredentials: (state) => {
      state.recoveryCredentials = null;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setRegistrationCredentials: (
      state,
      action: PayloadAction<RegistrationCredentials>,
    ) => {
      state.registrationCredentials = action.payload;
    },
    setRecoveryHash: (state, action: PayloadAction<string>) => {
      if (state.recoveryCredentials) {
        state.recoveryCredentials.hash = action.payload;
      }
    },
    setRecoveryLogin: (state, action: PayloadAction<string>) => {
      state.recoveryCredentials = { hash: null, login: action.payload };
    },
  },
});

export const {
  clearRegistrationCredentials,
  clearRecoveryCredentials,
  setIsAuthenticated,
  setRegistrationCredentials,
  setRecoveryHash,
  setRecoveryLogin,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
