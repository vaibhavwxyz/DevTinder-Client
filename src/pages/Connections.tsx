import { useGetConnectionsQuery } from "../api/connectionsApi";

// Define connection profile structure based on API response
interface ConnectionProfile {
  _id: string;
  firstName: string;
  lastName?: string;
  skills?: string[];
  emailId?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export default function Connections() {
  const {
    data: connectionsData,
    isLoading,
    refetch,
  } = useGetConnectionsQuery();

  console.log("Connections Data:", connectionsData); // Debugging

  if (isLoading) {
    return <div className="text-center py-8">Loading connections...</div>;
  }

  if (
    !connectionsData?.connections ||
    connectionsData.connections.length === 0
  ) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          You don't have any connections yet.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Start connecting with developers from the feed!
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
        <h1 className="text-2xl font-bold text-gray-900">My Connections</h1>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 gradient-primary text-white font-medium shadow-sm rounded-md hover:shadow-md focus:outline-none"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {connectionsData.connections.map((profile: ConnectionProfile) => (
          <div
            key={profile._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border-0"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full w-10 h-10 flex items-center justify-center text-white">
                  {profile.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.firstName} {profile.lastName || ""}
                  </h3>
                  {profile.emailId && (
                    <p className="text-sm text-gray-500">{profile.emailId}</p>
                  )}
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

              {(profile.emailId ||
                profile.github ||
                profile.linkedin ||
                profile.portfolio) && (
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Contact Information
                  </h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {profile.emailId && (
                      <li className="py-2 flex justify-between">
                        <span className="text-sm text-gray-500">Email</span>
                        <a
                          href={`mailto:${profile.emailId}`}
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          {profile.emailId}
                        </a>
                      </li>
                    )}
                    {profile.github && (
                      <li className="py-2 flex justify-between">
                        <span className="text-sm text-gray-500">GitHub</span>
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          View Profile
                        </a>
                      </li>
                    )}
                    {profile.linkedin && (
                      <li className="py-2 flex justify-between">
                        <span className="text-sm text-gray-500">LinkedIn</span>
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          View Profile
                        </a>
                      </li>
                    )}
                    {profile.portfolio && (
                      <li className="py-2 flex justify-between">
                        <span className="text-sm text-gray-500">Portfolio</span>
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          View Site
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
