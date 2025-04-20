import { useState } from "react";
import { useGetFeedQuery } from "../api/connectionsApi";
import { useSendRequestMutation } from "../api/connectionsApi";
import { Profile } from "../api/profileApi";

export default function Feed() {
  const { data: feedData, isLoading, refetch } = useGetFeedQuery();
  const [sendRequest, { isLoading: isSending }] = useSendRequestMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendRequest = async (userId: string, status: string) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await sendRequest({ userId, status }).unwrap();

      if (response.success) {
        setSuccessMessage(`Request sent successfully! Status: ${status}`);
        refetch(); // Refresh the feed
      } else {
        setError(response.message || "Failed to send request");
      }
    } catch (err: any) {
      setError(
        err.data?.message || "An error occurred while sending the request"
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading developers...</div>;
  }

  if (!feedData?.feed || feedData.feed.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          No developers found in your feed.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Check back later for new matches!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Developer Feed</h1>
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {feedData.feed.map((profile: Profile) => (
          <div
            key={profile._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border-0"
          >
            {/* Profile Card */}
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
                  {profile.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.firstName} {profile.lastName || ""}
                  </h3>
                  <p className="text-sm text-gray-500">{profile.emailId}</p>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{profile.bio}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
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
                <button
                  onClick={() => handleSendRequest(profile._id, "interested")}
                  disabled={isSending}
                  className="inline-flex items-center justify-center px-4 py-2 gradient-primary text-white font-medium shadow-sm rounded-md hover:shadow-md focus:outline-none flex-1"
                >
                  Interested
                </button>
                <button
                  onClick={() => handleSendRequest(profile._id, "ignored")}
                  disabled={isSending}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium shadow-sm rounded-md hover:bg-gray-300 hover:shadow-md focus:outline-none flex-1"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
