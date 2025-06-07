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
  Trophy,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
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

// Types
interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string;
  tickets: number[];
  purchaseDate: string;
  amount: number;
  avatar: string;
}

// Mock data for a specific raffle
const getRaffleData = (id: string) => {
  const raffles = {
    "1": {
      id: 1,
      title: "Help Luna Get Life-Saving Surgery",
      description:
        "Luna, a 3-year-old rescue dog, needs emergency surgery to remove a tumor. Every ticket helps save her life.",
      organizer: "Rescue Hearts Foundation",
      category: "Pets",
      goal: 15000,
      raised: 8500,
      ticketPrice: 10,
      endDate: "2024-12-30",
      status: "active",
      totalTickets: 1500,
      soldTickets: 850,
      location: "San Francisco, CA",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://rafflesforgood.com/raffle/1",
      participants: [
        {
          id: 1,
          name: "John Smith",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          tickets: [1, 45, 128],
          purchaseDate: "2024-12-15T10:30:00Z",
          amount: 30,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+1 (555) 234-5678",
          tickets: [2, 67, 234, 456],
          purchaseDate: "2024-12-16T14:20:00Z",
          amount: 40,
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 3,
          name: "Mike Davis",
          email: "mike@example.com",
          phone: "+1 (555) 345-6789",
          tickets: [3, 89, 345],
          purchaseDate: "2024-12-17T09:15:00Z",
          amount: 30,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 4,
          name: "Emma Wilson",
          email: "emma@example.com",
          phone: "+1 (555) 456-7890",
          tickets: [4, 156, 278, 389, 567],
          purchaseDate: "2024-12-18T16:45:00Z",
          amount: 50,
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 5,
          name: "Chris Brown",
          email: "chris@example.com",
          phone: "+1 (555) 567-8901",
          tickets: [5, 234, 567],
          purchaseDate: "2024-12-19T11:30:00Z",
          amount: 30,
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 6,
          name: "Lisa Chen",
          email: "lisa@example.com",
          phone: "+1 (555) 678-9012",
          tickets: [6, 123, 345, 678],
          purchaseDate: "2024-12-20T13:20:00Z",
          amount: 40,
          avatar:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 7,
          name: "David Kim",
          email: "david@example.com",
          phone: "+1 (555) 789-0123",
          tickets: [7, 234, 456],
          purchaseDate: "2024-12-21T08:45:00Z",
          amount: 30,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 8,
          name: "Anna Martinez",
          email: "anna@example.com",
          phone: "+1 (555) 890-1234",
          tickets: [8, 345, 567, 789, 890],
          purchaseDate: "2024-12-22T15:10:00Z",
          amount: 50,
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        },
      ],
      // Chart data for users joining over time
      chartData: [
        { date: "Dec 15", users: 1, cumulative: 1 },
        { date: "Dec 16", users: 1, cumulative: 2 },
        { date: "Dec 17", users: 1, cumulative: 3 },
        { date: "Dec 18", users: 1, cumulative: 4 },
        { date: "Dec 19", users: 1, cumulative: 5 },
        { date: "Dec 20", users: 1, cumulative: 6 },
        { date: "Dec 21", users: 1, cumulative: 7 },
        { date: "Dec 22", users: 1, cumulative: 8 },
      ],
    },
    "2": {
      id: 2,
      title: "School Supplies for Kids",
      description:
        "Help provide school supplies for underprivileged children in our community.",
      organizer: "Education First Foundation",
      category: "Education",
      goal: 8000,
      raised: 3200,
      ticketPrice: 5,
      endDate: "2024-12-28",
      status: "active",
      totalTickets: 1600,
      soldTickets: 640,
      location: "Austin, TX",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://rafflesforgood.com/raffle/2",
      participants: [
        {
          id: 1,
          name: "Robert Taylor",
          email: "robert@example.com",
          phone: "+1 (555) 987-6543",
          tickets: [1, 23, 67],
          purchaseDate: "2024-12-19T10:30:00Z",
          amount: 15,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 2,
          name: "Jessica Lee",
          email: "jessica@example.com",
          phone: "+1 (555) 876-5432",
          tickets: [2, 45, 89, 123],
          purchaseDate: "2024-12-20T14:20:00Z",
          amount: 20,
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        },
        {
          id: 3,
          name: "Tom Wilson",
          email: "tom@example.com",
          phone: "+1 (555) 765-4321",
          tickets: [3, 78, 123],
          purchaseDate: "2024-12-21T09:15:00Z",
          amount: 15,
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        },
      ],
      chartData: [
        { date: "Dec 19", users: 1, cumulative: 1 },
        { date: "Dec 20", users: 1, cumulative: 2 },
        { date: "Dec 21", users: 1, cumulative: 3 },
      ],
    },
  };

  return raffles[id as keyof typeof raffles] || raffles["1"];
};

export default function RaffleDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [raffle, setRaffle] = useState<ReturnType<typeof getRaffleData> | null>(
    null
  );

  // Check authentication and load raffle data
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      router.push("/signin");
      return;
    }

    setIsAuthenticated(true);

    // Load raffle data
    const raffleData = getRaffleData(params.id as string);
    setRaffle(raffleData);
  }, [router, params.id]);

  const handleShareRaffle = (raffleId: number, title: string) => {
    const url = `${window.location.origin}/campaign/${raffleId}`;
    navigator.clipboard.writeText(url);
    toast("Link Copied!", {
      description: `Raffle link for "${title}" has been copied to clipboard.`,
    });
  };

  const handleDownloadQR = (qrCodeUrl: string, title: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
      case "ended":
        return <Badge className="bg-gray-100 text-gray-700">Ended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated || !raffle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading raffle dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {raffle.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{raffle.description}</p>
              <div className="flex items-center gap-4">
                {getStatusBadge(raffle.status)}
                <Badge className="bg-gray-100 text-gray-700">
                  {raffle.category}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {raffle.location}
                </Badge>
                {raffle.status === "active" && (
                  <Badge className="bg-orange-100 text-orange-700">
                    <Clock className="w-3 h-3 mr-1" />
                    {getDaysLeft(raffle.endDate)} days left
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                by {raffle.organizer}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Image
                src={raffle.qrCode}
                alt={`QR Code for ${raffle.title}`}
                width={120}
                height={120}
                className="border rounded-lg"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadQR(raffle.qrCode, raffle.title)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleShareRaffle(raffle.id, raffle.title)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Raised ${raffle.raised.toLocaleString()}</span>
              <span>Goal ${raffle.goal.toLocaleString()}</span>
            </div>
            <Progress
              value={(raffle.raised / raffle.goal) * 100}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{raffle.soldTickets} tickets sold</span>
              <span>
                {((raffle.raised / raffle.goal) * 100).toFixed(1)}% funded
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {raffle.participants.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${raffle.raised.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {raffle.soldTickets}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Tickets/User</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(raffle.soldTickets / raffle.participants.length).toFixed(
                      1
                    )}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Joined Over Time Chart */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Participants Joined Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={raffle.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#059669"
                    fill="#d1fae5"
                    strokeWidth={2}
                    name="Total Participants"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Participants Grid */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Participants ({raffle.participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {raffle.participants.map((participant: Participant) => (
                <Card
                  key={participant.id}
                  className="border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="py-0 px-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {participant.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {participant.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {participant.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Ticket Numbers
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {participant.tickets.map((ticket: number) => (
                            <Badge
                              key={ticket}
                              variant="outline"
                              className="text-xs"
                            >
                              #{ticket}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-semibold text-green-600">
                          ${participant.amount}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Joined:</span>
                        <span className="text-gray-900">
                          {formatDate(participant.purchaseDate)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tickets:</span>
                        <Badge className="bg-blue-100 text-blue-700">
                          {participant.tickets.length} tickets
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <Link href={`/campaign/${raffle.id}`}>
            <Button variant="outline" size="lg">
              <Eye className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
          </Link>

          <Button variant="outline" size="lg">
            <ExternalLink className="w-4 h-4 mr-2" />
            Edit Raffle
          </Button>

          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              ← Back to All Raffles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
