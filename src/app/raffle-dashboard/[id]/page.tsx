"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Users,
  DollarSign,
  Eye,
  Share2,
  Download,
  ExternalLink,
  Clock,
  Mail,
  ArrowLeft,
  Calendar,
  Target,
  Ticket,
  QrCode,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "@/lib/auth-context";
import { raffleOperations, ticketOperations } from "@/lib/database-helpers";
import type { Database } from "@/lib/supabase";

type Raffle = Database["public"]["Tables"]["raffles"]["Row"] & {
  prize_type?: "money" | "item";
  prize_description?: string;
};
type Ticket = Database["public"]["Tables"]["tickets"]["Row"];

interface Participant {
  id: string;
  name: string;
  email: string;
  tickets: number[];
  purchaseDate: string;
  amount: number;
}

interface RaffleWithStats extends Raffle {
  participants: Participant[];
  chartData: Array<{
    date: string;
    users: number;
    cumulative: number;
  }>;
}

export default function RaffleDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [raffle, setRaffle] = useState<RaffleWithStats | null>(null);
  const [loading, setLoading] = useState(true);

  const raffleId = params.id as string;

  // Fetch raffle data and participants
  useEffect(() => {
    const fetchRaffleData = async () => {
      if (!user || !raffleId) return;

      try {
        console.log("Fetching raffle data for:", raffleId);

        // Fetch raffle details
        const raffleData = await raffleOperations.getRaffleById(raffleId);

        // Check if user is the organizer
        if (raffleData.organizer_id !== user.id) {
          toast("Access Denied", {
            description: "You can only manage raffles you created.",
          });
          router.push("/dashboard");
          return;
        }

        // Fetch tickets for this raffle
        const ticketsData = await ticketOperations.getTicketsByRaffle(raffleId);

        // Group tickets by participant
        const participantMap = new Map<string, Participant>();
        ticketsData.forEach((ticket) => {
          const key = ticket.participant_email;
          if (!participantMap.has(key)) {
            participantMap.set(key, {
              id: ticket.participant_email,
              name: ticket.participant_name,
              email: ticket.participant_email,
              tickets: [],
              purchaseDate: ticket.created_at,
              amount: 0,
            });
          }
          const participant = participantMap.get(key)!;
          participant.tickets.push(ticket.ticket_number);
          participant.amount += raffleData.ticket_price;
        });

        const participants = Array.from(participantMap.values());

        // Generate chart data - group tickets by date
        const dateMap = new Map<string, number>();
        ticketsData.forEach((ticket) => {
          const date = new Date(ticket.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });

        // Create chart data with cumulative values
        const sortedDates = Array.from(dateMap.entries()).sort(
          (a, b) =>
            new Date(a[0] + ", 2024").getTime() -
            new Date(b[0] + ", 2024").getTime()
        );

        let cumulative = 0;
        const chartData = sortedDates.map(([date, count]) => {
          cumulative += count;
          return {
            date,
            users: count,
            cumulative,
          };
        });

        const raffleWithStats: RaffleWithStats = {
          ...raffleData,
          participants,
          chartData:
            chartData.length > 0
              ? chartData
              : [{ date: "Today", users: 0, cumulative: 0 }],
        };

        setRaffle(raffleWithStats);
      } catch (error) {
        console.error("Error fetching raffle data:", error);
        toast("Error Loading Data", {
          description: "Could not load raffle data. Please try again.",
        });
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchRaffleData();
    } else if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, raffleId, router, toast]);

  const handleShareRaffle = () => {
    if (!raffle) return;
    const url = `${window.location.origin}/campaign/${raffle.id}`;
    navigator.clipboard.writeText(url);
    toast("Link Copied!", {
      description: `Raffle link has been copied to clipboard.`,
    });
  };

  const handleDownloadQR = () => {
    if (!raffle) return;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      `${window.location.origin}/join/${raffle.id}`
    )}`;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qr-code-${raffle.title
      .replace(/\s+/g, "-")
      .toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("QR Code Downloaded!", {
      description: `QR code has been downloaded.`,
    });
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-custom-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-custom-text">Loading raffle dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !raffle) {
    return null; // Will redirect
  }

  const progressPercentage = getProgressPercentage(
    raffle.raised_amount,
    raffle.goal_amount
  );
  const daysLeft = getDaysLeft(raffle.end_date);
  const statusText = getStatusText(raffle.status, raffle.end_date);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-custom-text/30 text-custom-text"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex gap-2">
              <Badge className={getCategoryColor(raffle.category)}>
                {raffle.category}
              </Badge>
              <Badge className={getStatusColor(raffle.status, raffle.end_date)}>
                {statusText}
              </Badge>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-custom-text mb-2">
            {raffle.title}
          </h1>
          <p className="text-custom-text/70 mb-4">{raffle.description}</p>
          <div className="flex items-center gap-6 text-sm text-custom-text/70">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Ends: {new Date(raffle.end_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {raffle.participants.length} participants
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            onClick={handleShareRaffle}
            className="w-full border-custom-text/30 text-custom-text"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Campaign
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadQR}
            className="w-full border-custom-text/30 text-custom-text"
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          <Link href={`/join/${raffle.id}`}>
            <Button
              variant="outline"
              className="w-full border-custom-text/30 text-custom-text"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Join Page
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Total Raised
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    ${raffle.raised_amount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Participants
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {raffle.participants.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Tickets Sold
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {raffle.tickets_sold}
                  </p>
                </div>
                <Ticket className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-custom-text/70">
                    Progress
                  </p>
                  <p className="text-2xl font-bold text-custom-text">
                    {Math.round(progressPercentage)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress and QR Code */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prize Information Card */}
            <Card className="shadow-custom border-0">
              <CardHeader>
                <CardTitle className="text-custom-text flex items-center gap-2">
                  🎁 Prize Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {raffle.prize_type === "item" ? (
                  <div className="flex items-start gap-3">
                    <Gift className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-custom-text mb-1">
                        Special Prize
                      </p>
                      <p className="text-sm text-custom-text/70 leading-relaxed">
                        {raffle.prize_description ||
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
                        Winner receives a portion of the funds raised
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="shadow-custom border-0">
              <CardHeader>
                <CardTitle className="text-custom-text">
                  Campaign Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-custom-text/70">
                      ${raffle.raised_amount.toLocaleString()} raised
                    </span>
                    <span className="text-sm font-semibold text-custom-text">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm text-custom-text/70 mt-2">
                    <span>Goal: ${raffle.goal_amount.toLocaleString()}</span>
                    <span>
                      $
                      {(
                        raffle.goal_amount - raffle.raised_amount
                      ).toLocaleString()}{" "}
                      remaining
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-custom-text/70">
                      Ticket Price:
                    </span>
                    <span className="text-sm font-medium text-custom-text">
                      ${raffle.ticket_price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-custom-text/70">
                      Tickets Sold:
                    </span>
                    <span className="text-sm font-medium text-custom-text">
                      {raffle.tickets_sold}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-custom-text/70">
                      Total Participants:
                    </span>
                    <span className="text-sm font-medium text-custom-text">
                      {raffle.participants.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="shadow-custom border-0">
              <CardHeader>
                <CardTitle className="text-custom-text flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `${
                        typeof window !== "undefined"
                          ? window.location.origin
                          : ""
                      }/join/${raffle.id}`
                    )}`}
                    alt="Raffle QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-custom-text/70 mb-4">
                  Participants can scan this QR code to join your raffle
                </p>
                <Button
                  onClick={handleDownloadQR}
                  className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Participants */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participation Chart */}
            <Card className="shadow-custom border-0">
              <CardHeader>
                <CardTitle className="text-custom-text">
                  Participation Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={raffle.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card className="shadow-custom border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-custom-text">
                    Participants ({raffle.participants.length})
                  </CardTitle>
                  {raffle.participants.length > 0 && (
                    <Badge
                      variant="outline"
                      className="border-custom-text/30 text-custom-text"
                    >
                      Total: $
                      {raffle.participants
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {raffle.participants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-custom-text/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-custom-text mb-2">
                      No participants yet
                    </h3>
                    <p className="text-custom-text/70">
                      Share your raffle to start getting participants!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {raffle.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-4 bg-custom-bg/5 rounded-lg border border-custom-text/10"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-custom-button/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-custom-button">
                              {participant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-custom-text">
                              {participant.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-custom-text/70">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {participant.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(participant.purchaseDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-custom-text">
                            ${participant.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-custom-text/70">
                            {participant.tickets.length} ticket
                            {participant.tickets.length !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-custom-text/50">
                            #{participant.tickets.join(", #")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
