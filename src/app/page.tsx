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

export default function Home() {
  const featuredRaffles = [
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
      raised: 12300,
      goal: 25000,
      ticketsLeft: 156,
      pricePerTicket: 25,
      category: "Medical",
      timeLeft: "8 days",
      organizer: "Community Care Network",
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
  ];

  const categories = [
    {
      name: "Medical",
      icon: Heart,
      count: 24,
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Pets",
      icon: Heart,
      count: 18,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Emergency",
      icon: Shield,
      count: 15,
      color: "bg-orange-100 text-orange-700",
    },
    {
      name: "Education",
      icon: Users,
      count: 12,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRaffles.map((raffle) => (
              <div
                key={raffle.id}
                className="bg-white rounded-xl shadow-custom border border-custom-bg/30 overflow-hidden hover:shadow-custom-lg transition-all duration-300 transform hover:-translate-y-1 h-[520px] flex flex-col"
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
                  <Badge className="absolute top-3 left-3 font-medium bg-custom-button/90 text-custom-text border-custom-button">
                    {raffle.category}
                  </Badge>

                  {/* Time Left Badge */}
                  <Badge className="absolute top-3 right-3 bg-white/95 text-custom-text border-white/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {raffle.timeLeft}
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
                      by {raffle.organizer}
                    </p>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-custom-text/70">
                        ${raffle.raised.toLocaleString()} raised
                      </span>
                      <span className="font-medium text-custom-text">
                        {Math.round((raffle.raised / raffle.goal) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(raffle.raised / raffle.goal) * 100}
                      className="h-2 bg-custom-bg/30"
                    />
                    <div className="flex justify-between text-xs text-custom-text/60 mt-1">
                      <span>Goal: ${raffle.goal.toLocaleString()}</span>
                      <span>{raffle.ticketsLeft} tickets left</span>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-custom-text/70">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="font-medium">
                        ${raffle.pricePerTicket}
                      </span>
                      <span className="text-custom-text/60 ml-1">
                        per ticket
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-custom-text/60">
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
                    <Button className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text font-medium py-3 rounded-lg transition-colors shadow-custom">
                      Join Raffle
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-custom-lg transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm shadow-custom"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-custom-button/20 flex items-center justify-center mx-auto mb-4">
                    <category.icon className="h-8 w-8 text-custom-text" />
                  </div>
                  <h3 className="text-lg font-semibold text-custom-text mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-custom-text/70">
                    {category.count} active raffles
                  </p>
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
