import { useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "../api/profileApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ExclamationTriangleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isPasswordUpdating }] =
    useUpdatePasswordMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Form fields
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    skills: "",
  });

  // Password fields
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Set form values when profile data is loaded
  const handleEditClick = () => {
    if (profileData?.profile) {
      setFormValues({
        firstName: profileData.profile.firstName || "",
        lastName: profileData.profile.lastName || "",
        bio: profileData.profile.bio || "",
        skills: profileData.profile.skills?.join(", ") || "",
      });
      setIsEditing(true);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const updateData = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        bio: formValues.bio,
        skills: formValues.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await updateProfile(updateData).unwrap();

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      setError(
        err.data?.message || "An error occurred while updating your profile"
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await updatePassword(passwordValues).unwrap();

      if (response.success) {
        setSuccessMessage("Password updated successfully!");
        setIsChangingPassword(false);
        setPasswordValues({ currentPassword: "", newPassword: "" });
      } else {
        setError(response.message || "Failed to update password");
      }
    } catch (err: any) {
      setError(
        err.data?.message || "An error occurred while updating your password"
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  if (isProfileLoading) {
    return <div className="text-center py-8">Loading your profile...</div>;
  }

  if (!profileData?.profile && !isProfileLoading) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load profile.
      </div>
    );
  }

  const profile = profileData?.profile;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-400">
          <p className="text-sm text-green-700">{successMessage}</p>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        {/* Profile Card */}
        <Card className="shadow-md border-0 rounded-lg overflow-hidden">
          <CardHeader className="relative">
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="absolute right-6 top-6 p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-indigo-600" />
              </button>
            )}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-indigo-500 text-white text-xl">
                <AvatarFallback>
                  {profile?.firstName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-gray-500">{profile?.emailId}</p>
                <p className="text-sm text-gray-400">
                  Member since{" "}
                  {profile?.createdAt && formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">About</h3>
                  <p className="mt-1 text-gray-600">
                    {profile?.bio || "No bio information provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Skills</h3>
                  {profile?.skills && profile.skills.length > 0 ? (
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
                  ) : (
                    <p className="mt-1 text-gray-600">No skills listed.</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                      className="focus:ring-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formValues.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    className="focus:ring-2"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formValues.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, JavaScript, UI Design"
                    className="focus:ring-2"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-0 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="gradient-primary text-white font-medium shadow-sm hover:shadow-md"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          {!isEditing && (
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="border-0 shadow-sm hover:shadow-md"
              >
                {isChangingPassword ? "Cancel" : "Change Password"}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Password Change Form */}
        {isChangingPassword && (
          <Card className="shadow-md border-0 rounded-lg overflow-hidden">
            <CardHeader>
              <h2 className="text-xl font-bold">Change Password</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="focus:ring-2"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="focus:ring-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters and include
                    uppercase, lowercase, numbers, and symbols.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPasswordUpdating}
                    className="gradient-primary text-white font-medium shadow-sm hover:shadow-md"
                  >
                    {isPasswordUpdating ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
