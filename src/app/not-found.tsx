import { Heart, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            raffle you&apos;re searching for might have ended or the link might
            be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Heart className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/start-raffle">
            <Button
              variant="outline"
              className="w-full border-green-300 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start a Raffle
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team or browse active raffles.
          </p>
        </div>
      </div>
    </div>
  );
}
