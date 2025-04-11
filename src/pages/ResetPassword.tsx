import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { handlePasswordReset, supabase } from "@/lib/supabase";
import { toast } from "sonner";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Verify the reset token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Invalid or expired reset link");
        navigate("/auth", { replace: true });
        return;
      }

      try {
        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "recovery",
        });

        if (error) {
          throw error;
        }

        setTokenValid(true);
      } catch (error) {
        toast.error("Reset link has expired or is invalid");
        navigate("/auth", { replace: true });
      }
    };

    verifyToken();
  }, [navigate, searchParams]);

  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!tokenValid) {
      toast.error("Reset link has expired");
      navigate("/auth", { replace: true });
      return;
    }

    try {
      setLoading(true);
      const { error } = await handlePasswordReset(values.password);

      if (error) throw error;

      // After successful password reset, invalidate all other sessions
      await supabase.auth.signOut({ scope: "global" });

      toast.success(
        "Password reset successfully! Please sign in with your new password."
      );
      navigate("/auth", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return null;
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gaming p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <Card className="bg-card mx-4">
          <CardHeader className="space-y-1 text-center py-8">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Reset Password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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
                      <FormMessage />
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• At least 6 characters</li>
                        <li>• One uppercase letter</li>
                        <li>• One lowercase letter</li>
                        <li>• One number</li>
                      </ul>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full focus:tv-focus"
                  tabIndex={0}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center py-6">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground underline focus:tv-focus"
              tabIndex={0}
            >
              Back to Sign In
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
