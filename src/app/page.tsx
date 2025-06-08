"use client";

import {
  Heart,
  QrCode,
  Shield,
  Users,
  ArrowRight,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { raffleOperations, categoryOperations } from "@/lib/database-helpers";

// Types
type Raffle = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  goal_amount: number;
  raised_amount: number;
  ticket_price: number;
  tickets_total: number;
  tickets_sold: number;
  category: string;
  organizer_name: string;
  end_date: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  }[];
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export default function Home() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [rafflesData, categoriesData] = await Promise.all([
          raffleOperations.getActiveRaffles(),
          categoryOperations.getCategories(),
        ]);

        setRaffles(rafflesData.slice(0, 3)); // Show first 3 raffles
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        // Keep empty arrays if there's an error
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Fallback data in case Supabase isn't set up yet
  const fallbackRaffles = [
    {
      id: "1",
      title: "Help Luna Get Life-Saving Surgery",
      description:
        "Luna, a 3-year-old rescue dog, needs emergency surgery to remove a tumor. Every ticket helps save her life.",
      image_url:
        "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop",
      raised_amount: 8500,
      goal_amount: 15000,
      tickets_sold: 850,
      tickets_total: 1500,
      ticket_price: 10,
      category: "Pets",
      end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      organizer_name: "Rescue Hearts Foundation",
    },
    {
      id: "2",
      title: "Medical Fund for Sarah's Cancer Treatment",
      description:
        "Help Sarah, a single mother of two, afford her cancer treatment and focus on recovery without financial stress.",
      image_url:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      raised_amount: 12300,
      goal_amount: 25000,
      tickets_sold: 492,
      tickets_total: 1000,
      ticket_price: 25,
      category: "Medical",
      end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      organizer_name: "Community Care Network",
    },
    {
      id: "3",
      title: "Rebuild the Johnson Family Home",
      description:
        "After losing their home in a fire, the Johnson family needs our help to rebuild and start fresh.",
      image_url:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      raised_amount: 18750,
      goal_amount: 30000,
      tickets_sold: 1250,
      tickets_total: 2000,
      ticket_price: 15,
      category: "Emergency",
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      organizer_name: "Neighbors Helping Neighbors",
    },
  ];

  const fallbackCategories = [
    {
      id: "1",
      name: "Medical",
      description: "Medical treatments and healthcare expenses",
      icon: "Heart",
      created_at: "",
    },
    {
      id: "2",
      name: "Pets",
      description: "Pet medical care and animal welfare",
      icon: "Heart",
      created_at: "",
    },
    {
      id: "3",
      name: "Emergency",
      description: "Emergency situations and urgent needs",
      icon: "Shield",
      created_at: "",
    },
    {
      id: "4",
      name: "Education",
      description: "Educational funding and scholarships",
      icon: "Users",
      created_at: "",
    },
  ];

  const displayRaffles = raffles.length > 0 ? raffles : fallbackRaffles;
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;

  // Helper function to calculate time left
  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ending today";
    if (diffDays === 1) return "1 day";
    return `${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-custom-text mb-6">
              Raffles for
              <span className="bg-gradient-to-r from-custom-button to-custom-bg bg-clip-text text-transparent block">
                Good Causes
              </span>
            </h1>
            <p className="text-xl text-custom-text mb-8 max-w-3xl mx-auto leading-relaxed">
              Create transparent, fair raffles for fundraising. Help pets get
              medical treatment, support families in need, or raise money for
              any cause. No apps required - just scan and join.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-custom-button hover:bg-custom-button/90 text-custom-text text-lg px-8 py-4 shadow-custom"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan to Join Raffle
              </Button>
              <Link href="/start-raffle">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-custom-text text-custom-text hover:bg-custom-bg/50 shadow-custom"
                >
                  Start Your Raffle
                </Button>
              </Link>
            </div>
            <div className="flex justify-center mt-10">
              <Badge className="mb-6 bg-custom-bg text-custom-text hover:bg-custom-bg/90">
                <Shield className="w-4 h-4 mr-2" />
                100% Transparent & Fair
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-custom-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-custom-button/20 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-custom-text" />
              </div>
              <h3 className="text-lg font-semibold text-custom-text mb-2">
                100% Transparent
              </h3>
              <p className="text-custom-text/80">
                Every draw is recorded and verifiable. See exactly where your
                money goes.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-custom-button/20 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-custom-text" />
              </div>
              <h3 className="text-lg font-semibold text-custom-text mb-2">
                Community Driven
              </h3>
              <p className="text-custom-text/80">
                Real people helping real causes in their communities.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-custom-button/20 p-3 rounded-full mb-4">
                <QrCode className="h-8 w-8 text-custom-text" />
              </div>
              <h3 className="text-lg font-semibold text-custom-text mb-2">
                No App Required
              </h3>
              <p className="text-custom-text/80">
                Simple QR code scanning. Works on any smartphone instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Raffles */}
      <section id="raffles" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-custom-text mb-4">
              Active Raffles
            </h2>
            <p className="text-xl text-custom-text/80">
              Join these ongoing raffles and make a difference today
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-custom-bg/20 rounded-xl h-[520px] animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayRaffles.map((raffle) => (
                <div
                  key={raffle.id}
                  className="bg-white rounded-xl shadow-custom border border-custom-bg/30 overflow-hidden hover:shadow-custom-lg transition-all duration-300 transform hover:-translate-y-1 h-[520px] flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={raffle.image_url || "/placeholder-image.jpg"}
                      alt={raffle.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Category Badge */}
                    <Badge className="absolute top-3 left-3 font-medium bg-custom-button/90 text-custom-text border-custom-button">
                      {raffle.category}
                    </Badge>

                    {/* Time Left Badge */}
                    <Badge className="absolute top-3 right-3 bg-white/95 text-custom-text border-white/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeLeft(raffle.end_date)}
                    </Badge>

                    {/* Verified Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/95 px-2 py-1 rounded-full">
                      <div className="h-2 w-2 bg-custom-button rounded-full"></div>
                      <span className="text-xs font-medium text-custom-text">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title and Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-custom-text mb-2 line-clamp-2">
                        {raffle.title}
                      </h3>
                      <p className="text-custom-text/70 text-sm line-clamp-2 mb-2">
                        {raffle.description}
                      </p>
                      <p className="text-xs text-custom-text/60">
                        by {raffle.organizer_name}
                      </p>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-custom-text/70">
                          ${raffle.raised_amount.toLocaleString()} raised
                        </span>
                        <span className="font-medium text-custom-text">
                          {Math.round(
                            (raffle.raised_amount / raffle.goal_amount) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (raffle.raised_amount / raffle.goal_amount) * 100
                        }
                        className="h-2 bg-custom-bg/30"
                      />
                      <div className="flex justify-between text-xs text-custom-text/60 mt-1">
                        <span>
                          Goal: ${raffle.goal_amount.toLocaleString()}
                        </span>
                        <span>
                          {raffle.tickets_total - raffle.tickets_sold} tickets
                          left
                        </span>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-custom-text/70">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="font-medium">
                          ${raffle.ticket_price}
                        </span>
                        <span className="text-custom-text/60 ml-1">
                          per ticket
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-custom-text/60">
                        <span>{raffle.tickets_sold} participants</span>
                      </div>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-1"></div>

                    {/* Action Button */}
                    <Link href={`/campaign/${raffle.id}`}>
                      <Button className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text font-medium py-3 rounded-lg transition-colors shadow-custom">
                        Join Raffle
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-custom-bg/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-custom-text mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-custom-text/80">
              Find raffles supporting causes you care about
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-custom-lg transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm shadow-custom"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-custom-button/20 flex items-center justify-center mx-auto mb-4">
                    {category.icon === "Heart" && (
                      <Heart className="h-8 w-8 text-custom-text" />
                    )}
                    {category.icon === "Shield" && (
                      <Shield className="h-8 w-8 text-custom-text" />
                    )}
                    {category.icon === "Users" && (
                      <Users className="h-8 w-8 text-custom-text" />
                    )}
                    {!["Heart", "Shield", "Users"].includes(
                      category.icon || ""
                    ) && <Heart className="h-8 w-8 text-custom-text" />}
                  </div>
                  <h3 className="text-lg font-semibold text-custom-text mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-custom-text/70">Active raffles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-custom-text to-custom-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Start your own raffle today and connect with people who want to
            support your cause.
          </p>
          <Link href="/start-raffle">
            <Button
              size="lg"
              className="bg-custom-button text-custom-text hover:bg-custom-button/90 text-lg px-8 py-4 shadow-custom-lg"
            >
              Start Your Raffle
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">RafflesForGood</span>
            </div>
            <p className="text-gray-400 mb-6">
              Making fundraising transparent, fair, and effective.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
