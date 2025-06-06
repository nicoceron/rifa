"use client";

import {
  Minus,
  Plus,
  Clock,
  Shield,
  Users,
  DollarSign,
  MapPin,
  QrCode,
  Share2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";

// Mock data - in a real app, this would come from an API
interface Campaign {
  id: number;
  title: string;
  description: string;
  organizer: string;
  image: string;
  raised: number;
  goal: number;
  participants: number;
  pricePerTicket: number;
  timeLeft: string;
  location: string;
  category: string;
}

const campaignData: { [key: string]: Campaign } = {
  "1": {
    id: 1,
    title: "Emergency Surgery for Sarah",
    description:
      "Help cover critical medical expenses for 8-year-old Sarah who needs emergency heart surgery. Sarah was born with a congenital heart defect that has progressively worsened. Doctors have determined that she needs immediate surgery to save her life.",
    organizer: "Sarah's Family",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d3c56?w=800&h=600&fit=crop",
    raised: 45000,
    goal: 80000,
    participants: 1847,
    pricePerTicket: 25,
    timeLeft: "12 days",
    location: "Seattle, WA",
    category: "Medical",
  },
  "2": {
    id: 2,
    title: "Help Luna Get Life-Saving Surgery",
    description:
      "Luna, a 3-year-old rescue dog, needs emergency surgery to remove a tumor. Every ticket helps save her life.",
    organizer: "Rescue Hearts Foundation",
    image:
      "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop",
    raised: 8500,
    goal: 15000,
    participants: 634,
    pricePerTicket: 10,
    timeLeft: "5 days",
    location: "Portland, OR",
    category: "Pets",
  },
  "3": {
    id: 3,
    title: "Rebuild the Johnson Family Home",
    description:
      "After losing their home in a fire, the Johnson family needs our help to rebuild and start fresh.",
    organizer: "Neighbors Helping Neighbors",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    raised: 18750,
    goal: 30000,
    participants: 892,
    pricePerTicket: 15,
    timeLeft: "3 days",
    location: "Denver, CO",
    category: "Emergency",
  },
};

export default function CampaignDetail() {
  const params = useParams();
  const campaign = campaignData[params.id as string];
  const [ticketQuantity, setTicketQuantity] = useState(1);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Campaign Not Found
          </h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  const remaining = campaign.goal - campaign.raised;
  const total = ticketQuantity * campaign.pricePerTicket;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  width={800}
                  height={400}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Campaign
                  </Badge>
                  <Badge
                    className={`${
                      campaign.category === "Medical"
                        ? "bg-red-100 text-red-700"
                        : campaign.category === "Pets"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {campaign.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {campaign.title}
                </h1>
                <p className="text-gray-600 mb-4">by {campaign.organizer}</p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="story">Full Story</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="transparency">Transparency</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {campaign.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-bold text-lg text-gray-900">
                          {campaign.participants.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Participants
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="font-bold text-lg text-gray-900">
                          ${campaign.pricePerTicket}
                        </div>
                        <div className="text-sm text-gray-600">Per Ticket</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="font-bold text-lg text-gray-900">
                          {campaign.timeLeft}
                        </div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="font-bold text-lg text-gray-900">
                          {campaign.location}
                        </div>
                        <div className="text-sm text-gray-600">Location</div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Shield className="w-6 h-6 text-purple-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Prize Details
                        </h3>
                      </div>
                      <div className="text-purple-800 font-semibold text-lg mb-2">
                        $5,000 Cash Prize + iPad Pro
                      </div>
                      <p className="text-purple-700 text-sm">
                        Winner will be selected transparently using blockchain
                        verification
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        This is where the full story of the campaign would be
                        displayed. It would include detailed information about
                        the cause, the beneficiary, and exactly how the funds
                        will be used.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        The story helps donors understand the urgency and
                        importance of their contribution, building trust and
                        encouraging participation in the raffle.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          Latest Update
                        </h3>
                        <span className="text-sm text-gray-500">
                          2 days ago
                        </span>
                      </div>
                      <p className="text-gray-700">
                        Thank you to everyone who has supported our campaign so
                        far. We&apos;re making great progress toward our goal!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transparency" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Campaign Verified</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          Organizer Identity Confirmed
                        </span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          Blockchain-Verified Drawings
                        </span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          100% Transparent Fund Usage
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fundraising Progress
                  </h3>
                  <div className="text-right text-sm text-gray-600">
                    {Math.round(progressPercentage)}% funded
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="h-3 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Raised:</span>
                      <span className="font-semibold text-gray-900">
                        ${campaign.raised.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Goal:</span>
                      <span className="font-semibold text-gray-900">
                        ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-semibold text-blue-600">
                        ${remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Purchase Tickets
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTicketQuantity(Math.max(1, ticketQuantity - 1))
                        }
                        disabled={ticketQuantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={ticketQuantity}
                        onChange={(e) =>
                          setTicketQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="text-center w-20"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per ticket:</span>
                      <span className="font-medium">
                        ${campaign.pricePerTicket}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{ticketQuantity}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">${total}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center text-orange-700 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Only {campaign.timeLeft} left to participate!
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                    <QrCode className="w-5 h-5 mr-2" />
                    Purchase {ticketQuantity} Ticket
                    {ticketQuantity > 1 ? "s" : ""}
                  </Button>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start text-green-700 text-xs">
                      <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Secure & Transparent</div>
                        <div>
                          Your tickets are blockchain-verified and cannot be
                          duplicated
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Share This Campaign
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    Show QR Code
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on Social Media
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
