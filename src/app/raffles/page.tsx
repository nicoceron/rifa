import { Clock, DollarSign, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function RafflesDirectory() {
  const allRaffles = [
    {
      id: 1,
      title: "Help Luna Get Life-Saving Surgery",
      description:
        "Luna, a 3-year-old rescue dog, needs emergency surgery to remove a tumor. Every ticket helps save her life.",
      image:
        "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
      raised: 8500,
      goal: 15000,
      ticketsLeft: 234,
      pricePerTicket: 10,
      category: "Pets",
      timeLeft: "5 days",
      organizer: "Rescue Hearts Foundation",
    },
    {
      id: 2,
      title: "Medical Fund for Sarah's Cancer Treatment",
      description:
        "Help Sarah, a single mother of two, afford her cancer treatment and focus on recovery without financial stress.",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      raised: 45000,
      goal: 80000,
      ticketsLeft: 156,
      pricePerTicket: 25,
      category: "Medical",
      timeLeft: "12 days",
      organizer: "Sarah's Family",
    },
    {
      id: 3,
      title: "Rebuild the Johnson Family Home",
      description:
        "After losing their home in a fire, the Johnson family needs our help to rebuild and start fresh.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      raised: 18750,
      goal: 30000,
      ticketsLeft: 89,
      pricePerTicket: 15,
      category: "Emergency",
      timeLeft: "3 days",
      organizer: "Neighbors Helping Neighbors",
    },
    {
      id: 4,
      title: "School Supplies for Underprivileged Kids",
      description:
        "Help provide essential school supplies and materials for children in underserved communities.",
      image:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop",
      raised: 3200,
      goal: 8000,
      ticketsLeft: 445,
      pricePerTicket: 5,
      category: "Education",
      timeLeft: "18 days",
      organizer: "Education for All Foundation",
    },
    {
      id: 5,
      title: "Emergency Food Relief for Families",
      description:
        "Provide emergency food packages for families affected by recent natural disasters in the region.",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop",
      raised: 12000,
      goal: 20000,
      ticketsLeft: 267,
      pricePerTicket: 8,
      category: "Emergency",
      timeLeft: "7 days",
      organizer: "Community Relief Network",
    },
    {
      id: 6,
      title: "Therapy Dog Training Program",
      description:
        "Fund the training of therapy dogs to help veterans and children with PTSD and anxiety disorders.",
      image:
        "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=300&fit=crop",
      raised: 6500,
      goal: 12000,
      ticketsLeft: 334,
      pricePerTicket: 12,
      category: "Pets",
      timeLeft: "15 days",
      organizer: "Healing Paws Foundation",
    },
  ];

  const categories = ["All", "Medical", "Pets", "Emergency", "Education"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Active{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent inline-block">
              Raffles
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-left">
            Discover ongoing raffles and support causes that matter to you.
            Every ticket makes a difference.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select defaultValue="all">
                <SelectTrigger className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Sort by: Newest First</SelectItem>
                  <SelectItem value="ending">Sort by: Ending Soon</SelectItem>
                  <SelectItem value="popular">Sort by: Most Popular</SelectItem>
                  <SelectItem value="goal">Sort by: Closest to Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {allRaffles.length} active raffles
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>All raffles are verified</span>
          </div>
        </div>

        {/* Raffles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRaffles.map((raffle) => (
            <div
              key={raffle.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-[520px] flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={raffle.image}
                  alt={raffle.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Category Badge */}
                <Badge
                  className={`absolute top-3 left-3 font-medium ${
                    raffle.category === "Pets"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : raffle.category === "Medical"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : raffle.category === "Education"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  }`}
                >
                  {raffle.category}
                </Badge>

                {/* Time Left Badge */}
                <Badge className="absolute top-3 right-3 bg-white/95 text-gray-700 border-white/20">
                  <Clock className="w-3 h-3 mr-1" />
                  {raffle.timeLeft}
                </Badge>

                {/* Verified Badge */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/95 px-2 py-1 rounded-full">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    Verified
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {raffle.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {raffle.description}
                  </p>
                  <p className="text-xs text-gray-500">by {raffle.organizer}</p>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      ${raffle.raised.toLocaleString()} raised
                    </span>
                    <span className="font-medium text-gray-900">
                      {Math.round((raffle.raised / raffle.goal) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(raffle.raised / raffle.goal) * 100}
                    className="h-2 bg-gray-100"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Goal: ${raffle.goal.toLocaleString()}</span>
                    <span>{raffle.ticketsLeft} tickets left</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      ${raffle.pricePerTicket}
                    </span>
                    <span className="text-gray-500 ml-1">per ticket</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      {Math.floor(raffle.raised / raffle.pricePerTicket)}{" "}
                      participants
                    </span>
                  </div>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="flex-1"></div>

                {/* Action Button */}
                <Link href={`/campaign/${raffle.id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors">
                    Join Raffle
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-green-300 hover:bg-green-50"
          >
            Load More Raffles
          </Button>
        </div>
      </div>
    </div>
  );
}
