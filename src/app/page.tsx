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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

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

  const steps = [
    {
      step: 1,
      title: "Scan QR Code",
      description:
        "Simply scan the QR code at the fundraising event or from promotional materials",
      icon: QrCode,
    },
    {
      step: 2,
      title: "Choose Tickets",
      description:
        "Select how many raffle tickets you'd like to purchase to support the cause",
      icon: DollarSign,
    },
    {
      step: 3,
      title: "Enter & Win",
      description:
        "Your entry is automatically recorded. Winners are drawn transparently and notified immediately",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                RafflesForGood
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#raffles"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Active Raffles
              </a>
              <a
                href="#categories"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Categories
              </a>
              <Link href="/start-raffle">
                <Button className="bg-green-600 hover:bg-green-700">
                  Start a Raffle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-green-100 text-green-700 hover:bg-green-100">
              <Shield className="w-4 h-4 mr-2" />
              100% Transparent & Fair
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Raffles for
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                Good Causes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create transparent, fair raffles for fundraising. Help pets get
              medical treatment, support families in need, or raise money for
              any cause. No apps required - just scan and join.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan to Join Raffle
              </Button>
              <Link href="/start-raffle">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-green-300 hover:bg-green-50"
                >
                  Start Your Raffle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Transparent
              </h3>
              <p className="text-gray-600">
                Every draw is recorded and verifiable. See exactly where your
                money goes.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Real people helping real causes in their communities.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <QrCode className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No App Required
              </h3>
              <p className="text-gray-600">
                Simple QR code scanning. Works on any smartphone instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Raffles */}
      <section id="raffles" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Active Raffles
            </h2>
            <p className="text-xl text-gray-600">
              Join these ongoing raffles and make a difference today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRaffles.map((raffle) => (
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

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <QrCode className="w-4 h-4 mr-2" />
                      Join Raffle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and effective fundraising in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-10 w-10 text-green-600" />
                </div>
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find raffles supporting causes you care about
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} active raffles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start your own raffle today and connect with people who want to
            support your cause.
          </p>
          <Link href="/start-raffle">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
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
