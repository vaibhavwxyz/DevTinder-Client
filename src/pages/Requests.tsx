import { useState } from "react";
import {
  useGetRequestsQuery,
  useReviewRequestMutation,
  ConnectionRequest,
} from "../api/connectionsApi";

// Define the correct request structure based on the API response
interface RequestSender {
  _id: string;
  firstName: string;
  lastName?: string;
  skills: string[];
}

interface Request {
  _id: string;
  senderId: RequestSender;
  receiverId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RequestsResponse {
  success: boolean;
  message: string;
  requests: Request[];
}

export default function Requests() {
  const { data: requestsData, isLoading, refetch } = useGetRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] =
    useReviewRequestMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleReviewRequest = async (requestId: string, status: string) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await reviewRequest({ requestId, status }).unwrap();

      if (response.success) {
        setSuccessMessage(
          `Request ${
            status === "accepted" ? "accepted" : "rejected"
          } successfully!`
        );
        refetch(); // Refresh the requests list
      } else {
        setError(response.message || "Failed to review request");
      }
    } catch (err: any) {
      setError(
        err.data?.message || "An error occurred while reviewing the request"
      );
    }
  };

  console.log("Requests Data:", requestsData); // Debugging

  if (isLoading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  if (!requestsData?.requests || requestsData.requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          You don't have any pending requests.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center px-4 py-2 gradient-primary text-white font-medium shadow-sm rounded-md hover:shadow-md focus:outline-none"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Connection Requests
        </h1>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 gradient-primary text-white font-medium shadow-sm rounded-md hover:shadow-md focus:outline-none"
        >
          Refresh
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {requestsData.requests.map((request) => (
          <div
            key={request._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border-0"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
                  {request.senderId.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {request.senderId.firstName}{" "}
                    {request.senderId.lastName || ""}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Status:
                    <span
                      className={`ml-1 font-medium ${
                        request.status === "interested"
                          ? "text-indigo-600"
                          : request.status === "accepted"
                          ? "text-green-600"
                          : request.status === "rejected"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {request.senderId.skills &&
                request.senderId.skills.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Skills
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {request.senderId.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
                {request.status === "interested" && (
                  <>
                    <button
                      onClick={() =>
                        handleReviewRequest(request._id, "accepted")
                      }
                      disabled={isReviewing}
                      className="inline-flex items-center justify-center px-4 py-2 gradient-primary text-white font-medium shadow-sm rounded-md hover:shadow-md focus:outline-none flex-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleReviewRequest(request._id, "rejected")
                      }
                      disabled={isReviewing}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium shadow-sm rounded-md hover:bg-red-700 hover:shadow-md focus:outline-none flex-1"
                    >
                      Reject
                    </button>
                  </>
                )}

                {(request.status === "accepted" ||
                  request.status === "rejected") && (
                  <div className="text-sm text-gray-500 italic mt-2">
                    This request has been {request.status}.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
