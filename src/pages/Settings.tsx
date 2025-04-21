import React, { useState, useRef } from "react";
import { TVLayout } from "../components/layout/TVLayout";
import {
  User,
  CreditCard,
  Gamepad2,
  Monitor,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { ControllerSettings } from "@/components/settings/ControllerSettings";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { v4 as uuidv4 } from "uuid";

interface ProfileFormValues {
  username: string;
  displayName?: string;
  // Add other profile fields as needed
}

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, user, refreshUser } = useAuth();

  const [selectedTab, setSelectedTab] = useState("profile");
  const [focusedSettingIndex, setFocusedSettingIndex] = useState(0);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(
    user?.user_metadata?.avatar_emoji || "👨‍🚀"
  );

  // Settings categories
  const settingsCategories = [
    { id: "profile", name: "User Profile", icon: User },
    { id: "credit", name: "Credit & Billing", icon: CreditCard },
    { id: "controllers", name: "Controllers", icon: Gamepad2 },
    { id: "display", name: "Display & Sound", icon: Monitor },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "help", name: "Help & Support", icon: HelpCircle },
  ];

  // Display settings state
  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    resolution: "1080p",
    refreshRate: "60Hz",
    hdr: false,
    volume: 80,
    mute: false,
  });

  // Controller settings state
  const [controllerSettings, setControllerSettings] = useState({
    vibration: true,
    sensitivity: 50,
    buttonMapping: "default",
    deadzone: 10,
  });

  // List of available avatar emojis
  const avatarEmojis = [
    "👨‍🚀",
    "👩‍🚀",
    "🦸‍♂️",
    "🦸‍♀️",
    "🧙‍♂️",
    "🧙‍♀️",
    "👾",
    "🤖",
    "👻",
    "🎮",
    "🕹️",
    "🎲",
    "🦊",
    "🐱",
    "🐶",
    "🐼",
    "🐨",
    "🦁",
  ];

  // Update userData to use emoji
  const userData = {
    name: user?.user_metadata?.username || "Player 1",
    email: user?.email || "player1@example.com",
    avatar_emoji: user?.user_metadata?.avatar_emoji || "👨‍🚀",
    memberSince: new Date(user?.created_at || Date.now()).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" }
    ),
    language: "English",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const handleKeyNavigation = (e: React.KeyboardEvent, index: number) => {
    // Handle TV remote navigation for settings sidebar
    if (e.key === "ArrowDown") {
      if (index < settingsCategories.length - 1) {
        setFocusedSettingIndex(index + 1);
        const nextItem = document.getElementById(`setting-${index + 1}`);
        nextItem?.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (index > 0) {
        setFocusedSettingIndex(index - 1);
        const prevItem = document.getElementById(`setting-${index - 1}`);
        prevItem?.focus();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;

      toast({
        description: "Signed out successfully",
      });
      navigate("/auth", { replace: true });
    } catch (error) {
      toast({
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleUsernameUpdate = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Update the username in profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", user.id);

      if (updateError) {
        if (updateError.message.includes("Username already taken")) {
          throw new Error("This username is already taken");
        }
        throw updateError;
      }

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      if (metadataError) throw metadataError;

      await refreshUser();
      toast({
        description: "Username updated successfully",
      });
      setIsEditingUsername(false);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: values.username,
          display_name: values.displayName,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshUser();
      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        description: "Error updating profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword) {
      toast({
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First verify the old password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: oldPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // If old password is correct, proceed with password update
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        description: "Password updated successfully",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordDialogOpen(false);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "delete") {
      toast({
        description: "Please type 'delete' to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the delete_user SQL function
      const { error } = await supabase.rpc("delete_user");

      if (error) {
        throw error;
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();
      navigate("/");
      toast({
        description: "Your account has been successfully deleted",
      });
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteConfirmation("");
    }
  };

  const handleAvatarChange = async (emoji: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_emoji: emoji })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_emoji: emoji },
      });

      if (metadataError) throw metadataError;

      setSelectedEmoji(emoji);
      await refreshUser();
      toast({
        description: "Avatar updated successfully",
      });
      setIsAvatarDialogOpen(false);
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TVLayout>
      <div className="h-full flex">
        {/* Settings sidebar */}
        <div className="w-64 bg-card border-r border-muted">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Settings</h2>

            <nav className="space-y-1">
              {settingsCategories.map((category, index) => (
                <button
                  key={category.id}
                  id={`setting-${index}`}
                  className={`w-full flex items-center py-3 px-4 rounded-lg transition-colors ${
                    selectedTab === category.id
                      ? "bg-gray-700 text-white"
                      : "hover:bg-muted"
                  } ${
                    focusedSettingIndex === index
                      ? "outline-none ring-2 ring-gray-500"
                      : ""
                  }`}
                  onClick={() => setSelectedTab(category.id)}
                  onFocus={() => setFocusedSettingIndex(index)}
                  onKeyDown={(e) => handleKeyNavigation(e, index)}
                  tabIndex={0}
                >
                  <category.icon className="h-5 w-5 min-w-[20px] mr-3" />
                  <span className="flex-1 text-left">{category.name}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-muted mt-8">
              <button
                className="w-full flex items-center py-3 px-4 rounded-lg text-red-500 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-gray-500"
                tabIndex={0}
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 min-w-[20px] mr-3" />
                <span className="flex-1 text-left">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto p-8 tv-scrollbar">
          {selectedTab === "profile" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">User Profile</h2>

              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mr-6">
                  {selectedEmoji}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{userData.name}</h3>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {userData.memberSince}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Profile Information
                    </h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Username</span>
                        <div className="flex items-center">
                          <span>{userData.name}</span>
                          <button
                            className="ml-3 text-gray-400 hover:underline focus:outline-none focus:text-gray-300"
                            tabIndex={0}
                            onClick={() => {
                              setNewUsername(userData.name);
                              setIsEditingUsername(true);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Email</span>
                        <span>{userData.email}</span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Avatar</span>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{selectedEmoji}</span>
                          <Dialog
                            open={isAvatarDialogOpen}
                            onOpenChange={setIsAvatarDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <button
                                className="text-gray-400 hover:underline focus:outline-none focus:text-gray-300"
                                tabIndex={0}
                              >
                                Change
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                              <DialogHeader>
                                <DialogTitle>Choose Avatar</DialogTitle>
                                <DialogDescription>
                                  Select an emoji to represent you in the game
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-6 gap-4 p-4">
                                {avatarEmojis.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleAvatarChange(emoji)}
                                    className={`text-2xl p-2 rounded-lg hover:bg-muted transition-colors ${
                                      selectedEmoji === emoji
                                        ? "bg-muted ring-2 ring-primary"
                                        : ""
                                    }`}
                                    disabled={isLoading}
                                    title={`Select ${emoji} as avatar`}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Security</h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Password</span>
                        <Dialog
                          open={isPasswordDialogOpen}
                          onOpenChange={setIsPasswordDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <button
                              className="text-gray-400 hover:underline focus:outline-none focus:text-gray-300"
                              tabIndex={0}
                            >
                              Change Password
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and a new password
                                for your account.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                  htmlFor="oldPassword"
                                  className="text-right text-sm"
                                >
                                  Current Password
                                </label>
                                <Input
                                  id="oldPassword"
                                  type="password"
                                  value={oldPassword}
                                  onChange={(e) =>
                                    setOldPassword(e.target.value)
                                  }
                                  className="col-span-3 bg-input text-foreground border-border"
                                  placeholder="Enter current password"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                  htmlFor="newPassword"
                                  className="text-right text-sm"
                                >
                                  New Password
                                </label>
                                <Input
                                  id="newPassword"
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  className="col-span-3 bg-input text-foreground border-border"
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                  htmlFor="confirmPassword"
                                  className="text-right text-sm"
                                >
                                  Confirm Password
                                </label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  className="col-span-3 bg-input text-foreground border-border"
                                  placeholder="Confirm new password"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  disabled={isLoading}
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                onClick={handlePasswordUpdate}
                                disabled={
                                  isLoading ||
                                  !oldPassword ||
                                  !newPassword ||
                                  newPassword !== confirmPassword
                                }
                              >
                                {isLoading ? "Updating..." : "Update Password"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Preferences</h3>
                    <div className="bg-card rounded-lg divide-y divide-muted">
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Language</span>
                        <span>English</span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-muted-foreground">Time Zone</span>
                        <span>
                          {userData.timezone} (Auto-detected based on your
                          location)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Delete Account</h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="w-full py-3 bg-red-500/10 text-red-500 rounded-lg text-center hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                          tabIndex={0}
                          disabled={isLoading}
                        >
                          Delete My Account
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card text-foreground">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-4">
                            <p>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </p>
                            <div className="space-y-2">
                              <label
                                htmlFor="deleteConfirmation"
                                className="text-sm font-medium"
                              >
                                Type "delete" to confirm:
                              </label>
                              <Input
                                id="deleteConfirmation"
                                value={deleteConfirmation}
                                onChange={(e) =>
                                  setDeleteConfirmation(e.target.value)
                                }
                                placeholder="Type 'delete' to confirm"
                                className="w-full"
                              />
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isLoading}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={
                              isLoading || deleteConfirmation !== "delete"
                            }
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {isLoading ? "Deleting..." : "Yes, delete account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "display" && (
            <DisplaySettings
              settings={displaySettings}
              onSettingsChange={setDisplaySettings}
            />
          )}

          {selectedTab === "controllers" && (
            <ControllerSettings
              settings={controllerSettings}
              onSettingsChange={setControllerSettings}
            />
          )}

          {selectedTab === "privacy" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Privacy Settings</h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Profile Visibility
                      </span>
                      <select
                        className="bg-muted rounded px-3 py-1"
                        aria-label="Profile visibility setting"
                        title="Profile visibility setting"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Activity Status
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          aria-label="Activity status toggle"
                          title="Toggle activity status"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Security Settings
                  </h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Login History
                      </span>
                      <button className="text-blue-500 hover:underline">
                        View
                      </button>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Connected Devices
                      </span>
                      <button className="text-blue-500 hover:underline">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "help" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Help & Support</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Frequently Asked Questions
                  </h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4">
                      <h4 className="font-medium mb-2">
                        How do I connect my controller?
                      </h4>
                      <p className="text-muted-foreground">
                        To connect your controller, go to Settings {">"}{" "}
                        Controllers and follow the on-screen instructions.
                      </p>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">
                        How do I change my display settings?
                      </h4>
                      <p className="text-muted-foreground">
                        Navigate to Settings {">"} Display & Sound to adjust
                        your display and audio preferences.
                      </p>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">
                        How do I manage my privacy settings?
                      </h4>
                      <p className="text-muted-foreground">
                        Visit Settings {">"} Privacy & Security to control your
                        privacy preferences and security settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Support</h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4">
                      <p className="text-muted-foreground mb-4">
                        Need additional help? Our support team is available
                        24/7.
                      </p>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "credit" && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Credit & Billing</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Methods</h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Current Plan
                      </span>
                      <span>Free Tier</span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Next Billing Date
                      </span>
                      <span>N/A</span>
                    </div>
                    <div className="p-4">
                      <button className="text-blue-500 hover:underline">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Billing History</h3>
                  <div className="bg-card rounded-lg divide-y divide-muted">
                    <div className="p-4">
                      <p className="text-muted-foreground">
                        No billing history available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Username Edit Dialog */}
      <Dialog open={isEditingUsername} onOpenChange={setIsEditingUsername}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
            <DialogDescription>
              Enter a new username. It must be unique and can only contain
              letters, numbers, underscores, and hyphens.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditingUsername(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUsernameUpdate}
                disabled={
                  isLoading || !newUsername || newUsername === userData.name
                }
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TVLayout>
  );
}
