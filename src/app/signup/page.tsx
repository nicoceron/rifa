"use client";

import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Navbar from "@/components/navbar";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast("Please fill in all fields", {
        description: "All fields are required to create an account.",
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords don't match", {
        description: "Please make sure both password fields match.",
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const { error } = await signUp(
        formData.email,
        formData.password,
        fullName
      );

      if (error) {
        toast("Sign Up Failed", {
          description: error.message,
        });
        setLoading(false);
        return;
      }

      toast("Account Created Successfully!", {
        description: "Please check your email to verify your account.",
      });

      // Redirect to dashboard after successful signup
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast("Something went wrong", {
        description: "Please try again later.",
      });
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth with Supabase
    toast("Google Sign Up Coming Soon!", {
      description: "For now, please use email and password to sign up.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-md shadow-custom border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-10 w-10 text-custom-button mr-2" />
                <span className="text-2xl font-bold bg-gradient-to-r from-custom-button to-custom-bg bg-clip-text text-transparent">
                  RafflesForGood
                </span>
              </div>
              <h1 className="text-2xl font-bold text-custom-text mb-2">
                Create Your Account
              </h1>
              <p className="text-custom-text/70">
                Join our community and start making a difference
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Signup Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-custom-text border-custom-text/30 hover:bg-custom-bg/20"
                onClick={handleGoogleSignup}
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

              <div className="relative">
                <Separator className="bg-custom-text/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-4 text-sm text-custom-text/60">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-custom-text">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10 border-custom-text/30 text-custom-text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-custom-text">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        className="pl-10 border-custom-text/30 text-custom-text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-custom-text">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 border-custom-text/30 text-custom-text"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-custom-text">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 border-custom-text/30 text-custom-text"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-custom-text/60 hover:text-custom-text"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-custom-text">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 border-custom-text/30 text-custom-text"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-custom-text/60 hover:text-custom-text"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-xs text-custom-text/60">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="#"
                    className="text-custom-button hover:text-custom-button/80"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-custom-button hover:text-custom-button/80"
                  >
                    Privacy Policy
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-custom-button hover:bg-custom-button/90 text-custom-text shadow-custom"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="text-center text-sm text-custom-text/70">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-custom-button hover:text-custom-button/80 font-medium"
                >
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
