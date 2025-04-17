import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, UserPlus, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import debounce from "lodash/debounce";

// Define form validation schemas
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters" })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
          "Username can only contain letters, numbers, underscores, and hyphens",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/(?=.*[0-9])/, {
        message: "Password must contain at least one number",
      })
      .regex(/(?=.*[!@#$%^&*])/, {
        message:
          "Password must contain at least one special character (!@#$%^&*)",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Add a function to detect mobile devices
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Update the form message styling with the correct color
const FormErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[#EB5B00] text-sm font-medium">{children}</div>
);

// Update the FormMessage component with the correct color
const FormMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[#EB5B00] text-sm font-medium">{children}</div>
);

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
    "login"
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOnMobile] = useState(isMobile());
  const [emailExists, setEmailExists] = useState(false);

  // Refs for focus management
  const loginFormRef = useRef<HTMLFormElement>(null);
  const signupFormRef = useRef<HTMLFormElement>(null);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Add this function to check email existence
  const checkEmailExists = useCallback(
    debounce(async (email: string) => {
      if (!email || !email.includes("@")) return;

      try {
        // Try to sign in with magic link without creating a user
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          },
        });

        // If there's no error, it means the email exists
        setEmailExists(!error);
      } catch {
        setEmailExists(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (data === null || data.user === null) {
          return;
        }

        // User is already logged in, redirect to home
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, [navigate]);

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);

      // Try to sign in
      const { error } = await signIn(values.email, values.password);

      if (error) {
        // Always show "Invalid credentials" regardless of the error
        throw new Error("Invalid credentials");
      }

      // Get the user data after successful login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      toast.success("Logged in successfully!");

      // Redirect to the originally requested page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      // Always show "Invalid credentials" for any error during login
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      setLoading(true);

      // Check if email exists first
      if (emailExists) {
        throw new Error("Email already registered");
      }

      // Try to sign up directly - Supabase will handle duplicate emails
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });

      if (signUpError) {
        // Check for various "already exists" error messages
        const errorMsg = signUpError.message.toLowerCase();
        if (
          errorMsg.includes("already registered") ||
          errorMsg.includes("already exists") ||
          errorMsg.includes("already taken")
        ) {
          throw new Error("Email already registered");
        }
        throw signUpError;
      }

      // If we have a user but email_confirmed_at is null, it's a new signup
      if (data?.user && !data.user.email_confirmed_at) {
        // Create the profile
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username: values.username,
            email: values.email,
          },
        ]);

        if (insertError) {
          // If profile creation fails, we should log out the user
          await supabase.auth.signOut();
          throw new Error("Failed to create profile");
        }

        toast.success(
          "Please check your email for a confirmation link to complete your registration"
        );
        setAuthMode("login");
        return;
      }

      // If we get here with a user, it means the email already exists
      if (data?.user) {
        throw new Error("Email already registered");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset link sent to your email");
      setAuthMode("login");
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // Add autofocus for mobile devices
  useEffect(() => {
    if (isOnMobile) {
      const input = document.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  }, [isOnMobile, authMode]);

  return (
    <div
      className={`min-h-screen w-screen flex flex-col items-center justify-center bg-gaming p-4 ${
        isOnMobile ? "pb-20" : "" // Add extra padding at bottom for mobile keyboards
      }`}
    >
      {authMode !== "login" && (
        <button
          className="fixed top-4 left-4 md:top-8 md:left-8 p-2 rounded-full bg-card hover:bg-muted transition-colors focus:tv-focus"
          onClick={() => setAuthMode("login")}
          tabIndex={0}
          disabled={loading}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </button>
      )}

      {authMode === "login" && (
        <div className="w-full max-w-lg animate-fade-in">
          <Card className={`bg-card mx-4 ${isOnMobile ? "mt-0" : ""}`}>
            <CardHeader className="space-y-1 text-center py-8">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base">
                Enter your email and password to sign in
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`space-y-4 ${isOnMobile ? "px-4" : "px-6"}`}
            >
              <Form {...loginForm}>
                <form
                  ref={loginFormRef}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            {...field}
                            className="focus:tv-focus-input"
                            tabIndex={0}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormErrorMessage>
                          {loginForm.formState.errors[field.name]?.message}
                        </FormErrorMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="focus:tv-focus-input pr-10"
                              tabIndex={0}
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:tv-focus"
                              tabIndex={0}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormErrorMessage>
                          {loginForm.formState.errors[field.name]?.message}
                        </FormErrorMessage>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full focus:tv-focus"
                    tabIndex={0}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <button
                  onClick={() => setAuthMode("forgot")}
                  className="text-sm text-muted-foreground hover:text-foreground underline focus:tv-focus"
                  tabIndex={0}
                >
                  Forgot password?
                </button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="underline text-cloud hover:text-cloud-focus focus:tv-focus-text"
                  tabIndex={0}
                  disabled={loading}
                >
                  Sign up
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {authMode === "signup" && (
        <div className="w-full max-w-lg animate-fade-in">
          <Card className={`bg-card mx-4 ${isOnMobile ? "mt-0" : ""}`}>
            <CardHeader className="space-y-1 text-center py-6">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`space-y-4 ${isOnMobile ? "px-4" : "px-6"}`}
            >
              <Form {...signupForm}>
                <form
                  ref={signupFormRef}
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe"
                              {...field}
                              className="focus:tv-focus-input"
                              tabIndex={0}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormErrorMessage>
                            {signupForm.formState.errors[field.name]?.message}
                          </FormErrorMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              {...field}
                              className={`focus:tv-focus-input ${
                                emailExists ? "border-[#EB5B00]" : ""
                              }`}
                              tabIndex={0}
                              disabled={loading}
                              onChange={(e) => {
                                field.onChange(e);
                                checkEmailExists(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormErrorMessage>
                            {emailExists
                              ? "Email already registered"
                              : signupForm.formState.errors[field.name]
                                  ?.message}
                          </FormErrorMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="focus:tv-focus-input pr-10"
                                tabIndex={0}
                                disabled={loading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:tv-focus"
                                tabIndex={0}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormErrorMessage>
                            {signupForm.formState.errors[field.name]?.message}
                          </FormErrorMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="focus:tv-focus-input pr-10"
                                tabIndex={0}
                                disabled={loading}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:tv-focus"
                                tabIndex={0}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormErrorMessage>
                            {signupForm.formState.errors[field.name]?.message}
                          </FormErrorMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full focus:tv-focus mt-6"
                    tabIndex={0}
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center py-6">
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("login")}
                  className="underline text-cloud hover:text-cloud-focus focus:tv-focus-text"
                  tabIndex={0}
                  disabled={loading}
                >
                  Sign in
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {authMode === "forgot" && (
        <div className="w-full max-w-lg animate-fade-in">
          <Card className={`bg-card mx-4 ${isOnMobile ? "mt-0" : ""}`}>
            <CardHeader className="space-y-1 text-center py-8">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Reset Password
              </CardTitle>
              <CardDescription className="text-base">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = loginForm.getValues("email");
                    handleForgotPassword(email);
                  }}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            {...field}
                            className="focus:tv-focus-input"
                            tabIndex={0}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormErrorMessage>
                          {loginForm.formState.errors[field.name]?.message}
                        </FormErrorMessage>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full focus:tv-focus"
                    tabIndex={0}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <button
                onClick={() => setAuthMode("login")}
                className="text-sm text-muted-foreground hover:text-foreground underline focus:tv-focus"
                tabIndex={0}
              >
                Back to Sign In
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

// Profile Button Component
const ProfileButton = ({
  name,
  emoji,
  onClick,
}: {
  name: string;
  emoji: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="flex flex-col items-center p-4 rounded-xl hover:bg-muted transition-all duration-300 focus:tv-focus"
      onClick={onClick}
      tabIndex={0}
    >
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted mb-4 text-4xl">
        {emoji}
      </div>
      <span className="text-lg font-medium">{name}</span>
    </button>
  );
};
