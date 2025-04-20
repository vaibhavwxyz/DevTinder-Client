import { apiSlice } from "./apiSlice";

export interface User {
  _id: string;
  firstName: string;
  emailId: string;
}

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: string;
  skills?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
