import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
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
            <Link
              href="/dashboard"
              className="text-custom-text hover:text-custom-button transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link href="/start-raffle">
              <Button className="bg-custom-button hover:bg-custom-button/90 text-custom-text shadow-custom">
                Start a Raffle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
