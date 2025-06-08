"use client";

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
import { useEffect, useState } from "react";
import { raffleOperations } from "@/lib/database-helpers";
import type { Database } from "@/lib/supabase";

type Raffle = Database["public"]["Tables"]["raffles"]["Row"];

export default function RafflesDirectory() {
  const [allRaffles, setAllRaffles] = useState<Raffle[]>([]);
  const [filteredRaffles, setFilteredRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["All", "Medical", "Pets", "Emergency", "Education"];

  // Fetch all active raffles
  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const raffles = await raffleOperations.getActiveRaffles();
        setAllRaffles(raffles);
        setFilteredRaffles(raffles);
      } catch (error) {
        console.error("Error fetching raffles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  // Filter and sort raffles
  useEffect(() => {
    let filtered = [...allRaffles];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (raffle) =>
          raffle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          raffle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          raffle.organizer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (raffle) =>
          raffle.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort raffles
    switch (sortBy) {
      case "ending":
        filtered.sort(
          (a, b) =>
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.tickets_sold - a.tickets_sold);
        break;
      case "goal":
        filtered.sort((a, b) => {
          const aProgress = (a.raised_amount / a.goal_amount) * 100;
          const bProgress = (b.raised_amount / b.goal_amount) * 100;
          return bProgress - aProgress;
        });
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredRaffles(filtered);
  }, [allRaffles, searchTerm, selectedCategory, sortBy]);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Medical: "bg-red-100 text-red-700",
      Pets: "bg-blue-100 text-blue-700",
      Emergency: "bg-orange-100 text-orange-700",
      Education: "bg-green-100 text-green-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading raffles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
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
              <Select value={sortBy} onValueChange={setSortBy}>
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
            Showing {filteredRaffles.length} active raffles
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>All raffles are verified</span>
          </div>
        </div>

        {/* Raffles Grid */}
        {filteredRaffles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No raffles found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are no active raffles at the moment. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRaffles.map((raffle) => {
              const progressPercentage = getProgressPercentage(
                raffle.raised_amount,
                raffle.goal_amount
              );
              const daysLeft = getDaysLeft(raffle.end_date);

              return (
                <div
                  key={raffle.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-[520px] flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={raffle.image_url || "/placeholder-image.jpg"}
                      alt={raffle.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(raffle.category)}>
                        {raffle.category}
                      </Badge>
                    </div>
                    {daysLeft <= 3 && daysLeft > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-100 text-red-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {daysLeft} days left
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {raffle.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {raffle.description}
                      </p>

                      {/* Organizer */}
                      <p className="text-xs text-gray-500 mb-4">
                        by {raffle.organizer_name}
                      </p>

                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            ${raffle.raised_amount.toLocaleString()} raised
                          </span>
                          <span className="text-sm text-gray-500">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <Progress
                          value={progressPercentage}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            Goal: ${raffle.goal_amount.toLocaleString()}
                          </span>
                          <span>{raffle.tickets_sold} tickets sold</span>
                        </div>
                      </div>

                      {/* Price and Time */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="font-semibold">
                            ${raffle.ticket_price}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">
                            per ticket
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/campaign/${raffle.id}`} className="w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                        View Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
