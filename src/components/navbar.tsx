"use client";

import { Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-custom-bg/30 sticky top-0 z-50 shadow-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-custom-button" />
            <span className="text-2xl font-bold bg-gradient-to-r from-custom-button to-custom-bg bg-clip-text text-transparent">
              RafflesForGood
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/raffles"
              className="text-custom-text hover:text-custom-button transition-colors font-medium"
            >
              Raffles
            </Link>

            {/* Show Dashboard only when logged in */}
            {user && (
              <Link
                href="/dashboard"
                className="text-custom-text hover:text-custom-button transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}

            <Link href="/start-raffle">
              <Button className="bg-custom-button hover:bg-custom-button/90 text-custom-text shadow-custom">
                Start a Raffle
              </Button>
            </Link>

            {/* Authentication UI */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-custom-bg/30 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-custom-text font-medium">
                  Welcome, {profile?.full_name?.split(" ")[0] || "User"}!
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-custom-button/20">
                        <User className="h-4 w-4 text-custom-text" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium text-custom-text">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-xs text-custom-text/60">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/start-raffle" className="w-full">
                        Create Raffle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className="text-custom-text hover:text-custom-button"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="border-custom-text text-custom-text hover:bg-custom-bg/50"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-custom-button/20">
                      <User className="h-4 w-4 text-custom-text" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium text-custom-text">
                      {profile?.full_name || "User"}
                    </p>
                    <p className="text-xs text-custom-text/60">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/raffles" className="w-full">
                      Raffles
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/start-raffle" className="w-full">
                      Create Raffle
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin">
                <Button
                  size="sm"
                  className="bg-custom-button hover:bg-custom-button/90 text-custom-text"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
