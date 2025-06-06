import { QrCode, Clock, DollarSign, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Active
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
              Raffles Directory
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover ongoing raffles and support causes that matter to you.
            Every ticket makes a difference.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-0 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search raffles by title or organizer..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
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
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="ending">Ending Soon</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="goal">Closest to Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {allRaffles.length}
            </div>
            <div className="text-gray-600">Active Raffles</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              $
              {allRaffles
                .reduce((sum, raffle) => sum + raffle.raised, 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600">Total Raised</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {allRaffles
                .reduce((sum, raffle) => sum + raffle.ticketsLeft, 0)
                .toLocaleString()}
            </div>
            <div className="text-gray-600">Tickets Available</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {categories.length - 1}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>

        {/* Raffles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allRaffles.map((raffle) => (
            <Card
              key={raffle.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative">
                <Image
                  src={raffle.image}
                  alt={raffle.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-4 left-4 ${
                    raffle.category === "Pets"
                      ? "bg-blue-100 text-blue-700"
                      : raffle.category === "Medical"
                      ? "bg-red-100 text-red-700"
                      : raffle.category === "Education"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {raffle.category}
                </Badge>
                <Badge className="absolute top-4 right-4 bg-white/90 text-gray-700">
                  <Clock className="w-3 h-3 mr-1" />
                  {raffle.timeLeft}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {raffle.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {raffle.description}
                </p>
                <p className="text-sm text-gray-500">by {raffle.organizer}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised ${raffle.raised.toLocaleString()}</span>
                      <span>Goal ${raffle.goal.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(raffle.raised / raffle.goal) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${raffle.pricePerTicket}/ticket</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span>{raffle.ticketsLeft} tickets left</span>
                    </div>
                  </div>

                  <Link href={`/campaign/${raffle.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <QrCode className="w-4 h-4 mr-2" />
                      Join Raffle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
