"use client";

import {
  Minus,
  Plus,
  Clock,
  Shield,
  Users,
  DollarSign,
  QrCode,
  Share2,
  CheckCircle,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import QRCodeComponent from "@/components/qr-code";
import { raffleOperations } from "@/lib/database-helpers";
import type { Database } from "@/lib/supabase";

type Raffle = Database["public"]["Tables"]["raffles"]["Row"] & {
  prize_type?: "money" | "item";
  prize_description?: string;
};

// Mock data - in a real app, this would come from an API

export default function CampaignDetail() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const raffleId = params.id as string;
        const raffleData = await raffleOperations.getRaffleById(raffleId);
        setCampaign(raffleData);
      } catch (error) {
        console.error("Error loading campaign:", error);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCampaign();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-custom-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-custom-text">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-custom-text mb-4">
            Campaign Not Found
          </h1>
          <Link href="/">
            <Button className="bg-custom-button hover:bg-custom-button/90 text-custom-text">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (campaign.raised_amount / campaign.goal_amount) * 100;
  const remaining = campaign.goal_amount - campaign.raised_amount;
  const total = ticketQuantity * campaign.ticket_price;
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.end_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                {campaign.image_url ? (
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    width={800}
                    height={400}
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 sm:h-80 bg-custom-bg/20 flex items-center justify-center">
                    <p className="text-custom-text/60">No image provided</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-custom-button/20 text-custom-text">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Campaign
                  </Badge>
                  <Badge className="bg-custom-button/20 text-custom-text">
                    {campaign.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold text-custom-text mb-2">
                  {campaign.title}
                </h1>
                <p className="text-custom-text/70 mb-4">
                  by {campaign.organizer_name}
                </p>

                <div className="prose max-w-none">
                  <p className="text-custom-text/80 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>

                {/* Prize Information */}
                <div className="mt-6 p-4 bg-gradient-to-r from-custom-button/10 to-custom-bg/10 rounded-lg border border-custom-button/20">
                  <h3 className="text-lg font-semibold text-custom-text mb-3 flex items-center">
                    🎁 What You Could Win
                  </h3>
                  {campaign.prize_type === "item" ? (
                    <div className="flex items-start gap-3">
                      <Gift className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-custom-text mb-1">
                          Special Prize
                        </p>
                        <p className="text-custom-text/80 leading-relaxed">
                          {campaign.prize_description ||
                            "Winner receives a special item or service"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-custom-text">
                          Cash Prize
                        </p>
                        <p className="text-sm text-custom-text/70">
                          Winner receives a portion of the funds raised for this
                          cause
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Section */}
                <div className="mt-8 p-6 bg-custom-bg/10 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-custom-text">
                      Progress
                    </span>
                    <span className="text-custom-text/70">
                      {Math.round(progressPercentage)}% funded
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-4" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <DollarSign className="w-6 h-6 text-custom-button mx-auto mb-2" />
                      <div className="font-bold text-lg text-custom-text">
                        ${campaign.raised_amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-custom-text/70">Raised</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <Users className="w-6 h-6 text-custom-button mx-auto mb-2" />
                      <div className="font-bold text-lg text-custom-text">
                        {campaign.tickets_sold}
                      </div>
                      <div className="text-sm text-custom-text/70">
                        Tickets Sold
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <DollarSign className="w-6 h-6 text-custom-button mx-auto mb-2" />
                      <div className="font-bold text-lg text-custom-text">
                        ${campaign.ticket_price}
                      </div>
                      <div className="text-sm text-custom-text/70">
                        Per Ticket
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <Clock className="w-6 h-6 text-custom-button mx-auto mb-2" />
                      <div className="font-bold text-lg text-custom-text">
                        {daysLeft}
                      </div>
                      <div className="text-sm text-custom-text/70">
                        Days Left
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="shadow-custom border-0">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-custom-text">
                    Fundraising Progress
                  </h3>
                  <div className="text-right text-sm text-custom-text/70">
                    {Math.round(progressPercentage)}% funded
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="h-3 mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-custom-text/70">Raised:</span>
                      <span className="font-semibold text-custom-text">
                        ${campaign.raised_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-custom-text/70">Goal:</span>
                      <span className="font-semibold text-custom-text">
                        ${campaign.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-custom-text/70">Remaining:</span>
                      <span className="font-semibold text-custom-button">
                        ${remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-custom border-0">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-custom-text">
                    Purchase Tickets
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-custom-text mb-2">
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
                        className="border-custom-text/30"
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
                        className="text-center w-20 border-custom-text/30"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                        className="border-custom-text/30"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-custom-text/70">
                        Price per ticket:
                      </span>
                      <span className="font-medium text-custom-text">
                        ${campaign.ticket_price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-custom-text/70">Quantity:</span>
                      <span className="font-medium text-custom-text">
                        {ticketQuantity}
                      </span>
                    </div>
                    <hr className="border-custom-text/20" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-custom-text">Total:</span>
                      <span className="text-custom-button">${total}</span>
                    </div>
                  </div>

                  <div className="bg-custom-bg/10 border border-custom-bg/20 rounded-lg p-3">
                    <div className="flex items-center text-custom-text text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Only {daysLeft} day{daysLeft !== 1 ? "s" : ""} left to
                      participate!
                    </div>
                  </div>

                  <Link href={`/join/${campaign.id}`}>
                    <Button className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text text-lg py-3 shadow-custom">
                      <QrCode className="w-5 h-5 mr-2" />
                      Purchase {ticketQuantity} Ticket
                      {ticketQuantity > 1 ? "s" : ""}
                    </Button>
                  </Link>

                  <div className="bg-custom-bg/10 border border-custom-bg/20 rounded-lg p-3">
                    <div className="flex items-start text-custom-text text-xs">
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

              <Card className="shadow-custom border-0">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-custom-text">
                    Quick Join QR Code
                  </h3>
                  <p className="text-sm text-custom-text/70">
                    Scan to join this raffle instantly
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <QRCodeComponent
                      value={`${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "https://rafflesforgood.com"
                      }/join/${campaign.id}`}
                      size={150}
                      className="border border-custom-bg/20"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-custom-text/60">
                      Share this QR code to let others join easily
                    </p>
                    <Link
                      href={`/join/${campaign.id}`}
                      className="text-sm text-custom-button hover:text-custom-button/80 font-medium"
                    >
                      /join/{campaign.id}
                    </Link>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-custom-text/30 text-custom-text"
                  >
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
