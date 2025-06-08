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
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth with Supabase
    toast("Google Sign In Coming Soon!", {
      description: "For now, please use email and password to sign in.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      toast("Please fill in all fields", {
        description: "Email and password are required to sign in.",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast("Sign In Failed", {
          description: error.message,
        });
        setLoading(false);
        return;
      }

      toast("Signed In Successfully!", {
        description: "Welcome back! Redirecting to your dashboard.",
      });

      // Redirect to dashboard after successful signin
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast("Something went wrong", {
        description: "Please try again later.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Heart className="h-10 w-10 text-custom-button" />
            <span className="text-3xl font-bold bg-gradient-to-r from-custom-button to-custom-bg bg-clip-text text-transparent">
              RafflesForGood
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-custom-text mb-2">
            Welcome Back
          </h1>
          <p className="text-custom-text/70">
            Sign in to manage your raffles and track participants
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-custom">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-custom-text">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base border-custom-text/30 hover:bg-custom-bg/20 text-custom-text"
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
                <div className="w-full border-t border-custom-text/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-custom-text/60">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-custom-text">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-custom-text/30 text-custom-text"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-custom-text">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10 border-custom-text/30 text-custom-text"
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
                      <EyeOff className="h-4 w-4 text-custom-text/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-custom-text/60" />
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
                  <Label
                    htmlFor="remember"
                    className="text-sm text-custom-text/70"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="#"
                  className="text-sm text-custom-button hover:text-custom-button/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-custom-button hover:bg-custom-button/90 text-custom-text text-base shadow-custom"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-custom-text/70">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-custom-button hover:text-custom-button/80 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-custom-text/60 mb-4">
            Trusted by organizations worldwide
          </p>
          <div className="flex justify-center space-x-6 text-xs text-custom-text/50">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Transparent</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>For Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
