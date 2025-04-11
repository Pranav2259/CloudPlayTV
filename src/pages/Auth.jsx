
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, UserPlus, ChevronLeft } from 'lucide-react';

// Define form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  
  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (values) => {
    console.log("Login values:", values);
    // Normally you would authenticate with an API here
    // For now, we'll just simulate a successful login
    setAuthMode('profiles');
  };

  const onSignupSubmit = (values) => {
    console.log("Signup values:", values);
    // Normally you would register with an API here
    // For now, we'll just simulate a successful signup
    setAuthMode('profiles');
  };

  // Function to handle profile selection
  const handleProfileSelect = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gaming">
      {authMode !== 'login' && (
        <button 
          className="absolute top-8 left-8 p-2 rounded-full bg-card hover:bg-muted transition-colors"
          onClick={() => authMode === 'signup' ? setAuthMode('login') : setAuthMode('login')}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </button>
      )}

      {authMode === 'login' && (
        <div className="w-full max-w-md animate-fade-in">
          <Card className="bg-card">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">Welcome to CloudPlay</CardTitle>
              <CardDescription>
                Enter your email and password to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Sign In</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{" "}
                <button 
                  onClick={() => setAuthMode('signup')}
                  className="underline text-cloud hover:text-cloud-focus"
                >
                  Sign up
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {authMode === 'signup' && (
        <div className="w-full max-w-md animate-fade-in">
          <Card className="bg-card">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <button 
                  onClick={() => setAuthMode('login')}
                  className="underline text-cloud hover:text-cloud-focus"
                >
                  Sign in
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {authMode === 'profiles' && (
        <div className="w-full max-w-3xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-12 text-center">Who's playing?</h2>
          
          <div className="grid grid-cols-5 gap-6">
            <ProfileButton name="Player 1" emoji="👨‍🚀" onClick={handleProfileSelect} />
            <ProfileButton name="Player 2" emoji="👩‍🚀" onClick={handleProfileSelect} />
            <ProfileButton name="Kid" emoji="👶" onClick={handleProfileSelect} />
            <ProfileButton name="Guest" emoji="👤" onClick={handleProfileSelect} />
            
            <button
              className="flex flex-col items-center p-4 rounded-xl hover:bg-muted transition-all duration-300"
              onClick={() => console.log("Add profile")}
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted mb-4">
                <UserPlus className="h-10 w-10 text-muted-foreground" />
              </div>
              <span className="text-lg font-medium">Add Profile</span>
            </button>
          </div>
          
          <p className="text-center mt-12 text-muted-foreground">
            Tip: Press and hold your controller button to quickly sign in next time
          </p>
        </div>
      )}
    </div>
  );
}

// Profile Button Component
const ProfileButton = ({ name, emoji, onClick }) => {
  return (
    <button
      className="flex flex-col items-center p-4 rounded-xl hover:bg-muted transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-20 h-20 text-4xl flex items-center justify-center rounded-full bg-muted mb-4">
        {emoji}
      </div>
      <span className="text-lg font-medium">{name}</span>
    </button>
  );
};
