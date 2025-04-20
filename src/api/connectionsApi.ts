import { apiSlice } from "./apiSlice";
import { Profile } from "./profileApi";

export interface RequestSender {
  _id: string;
  firstName: string;
  lastName?: string;
  skills: string[];
}

export interface ConnectionRequest {
  _id: string;
  senderId: RequestSender;
  receiverId: string;
  status: "ignored" | "interested" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionResponse {
  success: boolean;
  message: string;
  connections?: Profile[];
  requests?: ConnectionRequest[];
  feed?: Profile[];
  request?: ConnectionRequest;
}

export const connectionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query<ConnectionResponse, void>({
      query: () => "/user/connections",
      providesTags: ["Connections"],
    }),
    getRequests: builder.query<ConnectionResponse, void>({
      query: () => "/user/requests",
      providesTags: ["Requests"],
    }),
    getFeed: builder.query<ConnectionResponse, void>({
      query: () => "/user/feed",
      providesTags: ["Feed"],
    }),
    sendRequest: builder.mutation<
      ConnectionResponse,
      { status: string; userId: string }
    >({
      query: ({ status, userId }) => ({
        url: `/request/send/${status}/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Feed", "Connections"],
    }),
    reviewRequest: builder.mutation<
      ConnectionResponse,
      { status: string; requestId: string }
    >({
      query: ({ status, requestId }) => ({
        url: `/request/review/${status}/${requestId}`,
        method: "POST",
      }),
      invalidatesTags: ["Requests", "Connections"],
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useGetRequestsQuery,
  useGetFeedQuery,
  useSendRequestMutation,
  useReviewRequestMutation,
} = connectionsApi;
