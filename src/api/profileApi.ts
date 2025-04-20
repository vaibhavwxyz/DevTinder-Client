import { apiSlice } from "./apiSlice";
import { User } from "./authApi";

export interface Profile extends User {
  firstName: string;
  lastName?: string;
  emailId: string;
  age?: number;
  gender?: string;
  skills?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  lookingFor?: string[];
  experience?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  lookingFor?: string[];
  experience?: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: Profile;
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/profile/view",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<ProfileResponse, ProfileUpdateRequest>({
      query: (profileData) => ({
        url: "/profile/edit",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),
    updatePassword: builder.mutation<ProfileResponse, PasswordUpdateRequest>({
      query: (passwordData) => ({
        url: "/profile/password",
        method: "PATCH",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = profileApi;
