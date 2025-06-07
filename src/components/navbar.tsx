import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              RafflesForGood
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/raffles"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Raffles
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/start-raffle">
              <Button className="bg-green-600 hover:bg-green-700">
                Start a Raffle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
