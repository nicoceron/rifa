"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleSignIn = () => {
    // Mock Google signin - in real app this would integrate with Google OAuth
    localStorage.setItem("userToken", "mock-google-jwt-token-12345");
    localStorage.setItem("userEmail", "user@gmail.com");
    localStorage.setItem("userFirstName", "John");
    localStorage.setItem("userLastName", "Doe");

    toast("Signed In Successfully!", {
      description: "Welcome back! Redirecting to your dashboard.",
    });

    // Redirect to dashboard after successful signin
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast("Please fill in all fields", {
        description: "Email and password are required to sign in.",
      });
      return;
    }

    // Mock authentication - in real app this would call your auth API
    localStorage.setItem("userToken", "mock-jwt-token-12345");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userFirstName", "Demo");
    localStorage.setItem("userLastName", "User");

    toast("Signed In Successfully!", {
      description: "Welcome back! Redirecting to your dashboard.",
    });

    // Redirect to dashboard after successful signin
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Heart className="h-10 w-10 text-green-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              RafflesForGood
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to manage your raffles and track participants
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                width={20}
                height={20}
                className="mr-3"
              />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-green-600 hover:text-green-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-base"
              >
                Sign In
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-2 rounded-full mb-2">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Bank-level security</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-full mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Verified campaigns</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-2 rounded-full mb-2">
              <Heart className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">5-star support</p>
          </div>
        </div>

        {/* Demo Credentials */}
        <Card className="mt-6 border-amber-200 bg-amber-50/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">
              Demo Credentials
            </h3>
            <div className="space-y-1 text-xs text-amber-700">
              <p>
                <strong>Email:</strong> demo@example.com
              </p>
              <p>
                <strong>Password:</strong> demo123
              </p>
              <p className="text-amber-600 mt-2">
                Or use &quot;Continue with Google&quot; for instant access
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
