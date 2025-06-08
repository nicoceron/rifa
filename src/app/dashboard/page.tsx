"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  DollarSign,
  Share2,
  Download,
  Clock,
  Target,
  Trophy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { raffleOperations, ticketOperations } from "@/lib/database-helpers";
import type { Database } from "@/lib/supabase";

type Raffle = Database["public"]["Tables"]["raffles"]["Row"];
type Ticket = Database["public"]["Tables"]["tickets"]["Row"];

interface Participant {
  id: string;
  name: string;
  email: string;
  tickets: number[];
  purchaseDate: string;
}

interface RaffleWithTickets extends Raffle {
  tickets?: Ticket[];
  participants?: Participant[];
}

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [userRaffles, setUserRaffles] = useState<RaffleWithTickets[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's raffles
  useEffect(() => {
    const fetchUserRaffles = async () => {
      if (!user) return;

      try {
        console.log("Fetching raffles for user:", user.id);
        const raffles = await raffleOperations.getRafflesByOrganizer(user.id);

        // Fetch tickets for each raffle to get participant data
        const rafflesWithTickets = await Promise.all(
          raffles.map(async (raffle) => {
            try {
              const tickets = await ticketOperations.getTicketsByRaffle(
                raffle.id
              );

              // Group tickets by participant
              const participantMap = new Map();
              tickets.forEach((ticket) => {
                const key = `${ticket.participant_email}-${ticket.participant_name}`;
                if (!participantMap.has(key)) {
                  participantMap.set(key, {
                    id: ticket.participant_email,
                    name: ticket.participant_name,
                    email: ticket.participant_email,
                    tickets: [],
                    purchaseDate: ticket.created_at,
                  });
                }
                participantMap.get(key).tickets.push(ticket.ticket_number);
              });

              const participants = Array.from(participantMap.values());

              return {
                ...raffle,
                tickets,
                participants,
              };
            } catch (error) {
              console.error(
                "Error fetching tickets for raffle:",
                raffle.id,
                error
              );
              return {
                ...raffle,
                tickets: [],
                participants: [],
              };
            }
          })
        );

        setUserRaffles(rafflesWithTickets);
      } catch (error) {
        console.error("Error fetching user raffles:", error);
        toast("Error Loading Raffles", {
          description: "Could not load your raffles. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserRaffles();
    } else if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, router, toast]);

  const handleShareRaffle = (raffleId: string, title: string) => {
    const url = `${window.location.origin}/campaign/${raffleId}`;
    navigator.clipboard.writeText(url);
    toast("Link Copied!", {
      description: `Raffle link for "${title}" has been copied to clipboard.`,
    });
  };

  const handleDownloadQR = (raffleId: string, title: string) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `${window.location.origin}/join/${raffleId}`
    )}`;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qr-code-${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("QR Code Downloaded!", {
      description: `QR code for "${title}" has been downloaded.`,
    });
  };

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

  const getStatusColor = (status: string, endDate: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (getDaysLeft(endDate) === 0) return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const getStatusText = (status: string, endDate: string) => {
    if (status === "completed") return "Completed";
    if (getDaysLeft(endDate) === 0) return "Ended";
    return "Active";
  };

  // Calculate summary stats
  const totalRaised = userRaffles.reduce(
    (sum, raffle) => sum + raffle.raised_amount,
    0
  );
  const totalParticipants = userRaffles.reduce(
    (sum, raffle) => sum + (raffle.participants?.length || 0),
    0
  );
  const activeRaffles = userRaffles.filter(
    (raffle) => raffle.status === "active" && getDaysLeft(raffle.end_date) > 0
  ).length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-custom-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-custom-text">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-custom-text mb-2">
            Welcome back, {profile?.full_name || user.email}!
          </h1>
          <p className="text-custom-text/70">
            Manage your raffles and track their progress
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Total Raised
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    ${totalRaised.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-custom-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Active Raffles
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {activeRaffles}
                  </p>
                </div>
                <Target className="h-8 w-8 text-custom-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Total Participants
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {totalParticipants}
                  </p>
                </div>
                <Users className="h-8 w-8 text-custom-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Total Raffles
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {userRaffles.length}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-custom-button" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-custom-text">
            Your Raffles
          </h2>
          <Link href="/start-raffle">
            <Button className="bg-custom-button hover:bg-custom-button/90 text-custom-text">
              Create New Raffle
            </Button>
          </Link>
        </div>

        {/* Raffles List */}
        {userRaffles.length === 0 ? (
          <Card className="shadow-custom border-0">
            <CardContent className="p-12 text-center">
              <Trophy className="h-16 w-16 text-custom-text/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-custom-text mb-2">
                No raffles yet
              </h3>
              <p className="text-custom-text/70 mb-6">
                Create your first raffle to start fundraising for your cause
              </p>
              <Link href="/start-raffle">
                <Button className="bg-custom-button hover:bg-custom-button/90 text-custom-text">
                  Create Your First Raffle
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userRaffles.map((raffle) => {
              const progressPercentage = getProgressPercentage(
                raffle.raised_amount,
                raffle.goal_amount
              );
              const daysLeft = getDaysLeft(raffle.end_date);
              const statusText = getStatusText(raffle.status, raffle.end_date);

              return (
                <Card key={raffle.id} className="shadow-custom border-0">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Raffle Info */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={raffle.image_url || "/placeholder-image.jpg"}
                              alt={raffle.title}
                              width={120}
                              height={80}
                              className="w-full sm:w-30 h-20 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-custom-text">
                                {raffle.title}
                              </h3>
                              <div className="flex gap-2">
                                <Badge
                                  className={getCategoryColor(raffle.category)}
                                >
                                  {raffle.category}
                                </Badge>
                                <Badge
                                  className={getStatusColor(
                                    raffle.status,
                                    raffle.end_date
                                  )}
                                >
                                  {statusText}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-custom-text/70 mb-3 line-clamp-2">
                              {raffle.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-custom-text/70">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {daysLeft > 0
                                  ? `${daysLeft} days left`
                                  : "Ended"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {raffle.participants?.length || 0} participants
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress & Stats */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-custom-text/70">
                              Progress
                            </span>
                            <span className="text-sm font-semibold text-custom-text">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                          <Progress
                            value={progressPercentage}
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm text-custom-text/70 mt-1">
                            <span>
                              ${raffle.raised_amount.toLocaleString()}
                            </span>
                            <span>${raffle.goal_amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-lg font-semibold text-custom-text">
                              {raffle.tickets_sold}
                            </p>
                            <p className="text-xs text-custom-text/70">
                              Tickets Sold
                            </p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-custom-text">
                              ${raffle.ticket_price}
                            </p>
                            <p className="text-xs text-custom-text/70">
                              Per Ticket
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link href={`/raffle-dashboard/${raffle.id}`}>
                          <Button className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Raffle
                          </Button>
                        </Link>
                        <Link href={`/campaign/${raffle.id}`}>
                          <Button
                            variant="outline"
                            className="w-full border-custom-text/30 text-custom-text"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Campaign
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleShareRaffle(raffle.id, raffle.title)
                          }
                          className="w-full border-custom-text/30 text-custom-text"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleDownloadQR(raffle.id, raffle.title)
                          }
                          className="w-full border-custom-text/30 text-custom-text"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          QR Code
                        </Button>
                      </div>
                    </div>

                    {/* Participants Preview */}
                    {raffle.participants && raffle.participants.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-custom-text/10">
                        <h4 className="text-sm font-semibold text-custom-text mb-3">
                          Recent Participants ({raffle.participants.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {raffle.participants
                            .slice(0, 6)
                            .map((participant, index) => (
                              <div
                                key={index}
                                className="bg-custom-bg/10 rounded-lg p-3"
                              >
                                <p className="text-sm font-medium text-custom-text">
                                  {participant.name}
                                </p>
                                <p className="text-xs text-custom-text/70">
                                  {participant.tickets.length} ticket
                                  {participant.tickets.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            ))}
                        </div>
                        {raffle.participants.length > 6 && (
                          <p className="text-xs text-custom-text/70 mt-2">
                            +{raffle.participants.length - 6} more participants
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
