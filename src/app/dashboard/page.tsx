"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Users,
  DollarSign,
  Eye,
  Share2,
  Download,
  ExternalLink,
  Clock,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

// Mock data for user's raffles
const userRaffles = [
  {
    id: 1,
    title: "Help Luna Get Life-Saving Surgery",
    description: "Luna needs emergency surgery to remove a tumor",
    category: "Pets",
    goal: 15000,
    raised: 8500,
    ticketPrice: 10,
    endDate: "2024-12-30",
    status: "active",
    totalTickets: 1500,
    soldTickets: 850,
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://rafflesforgood.com/raffle/1",
    participants: [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        tickets: [1, 45, 128],
        purchaseDate: "2024-12-20",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        tickets: [2, 67, 234],
        purchaseDate: "2024-12-21",
      },
      {
        id: 3,
        name: "Mike Davis",
        email: "mike@example.com",
        tickets: [3, 89, 345],
        purchaseDate: "2024-12-21",
      },
      {
        id: 4,
        name: "Emma Wilson",
        email: "emma@example.com",
        tickets: [4, 156, 278],
        purchaseDate: "2024-12-22",
      },
      {
        id: 5,
        name: "Chris Brown",
        email: "chris@example.com",
        tickets: [5, 234, 567],
        purchaseDate: "2024-12-22",
      },
    ],
  },
  {
    id: 2,
    title: "School Supplies for Kids",
    description: "Help provide school supplies for underprivileged children",
    category: "Education",
    goal: 8000,
    raised: 3200,
    ticketPrice: 5,
    endDate: "2024-12-28",
    status: "active",
    totalTickets: 1600,
    soldTickets: 640,
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://rafflesforgood.com/raffle/2",
    participants: [
      {
        id: 1,
        name: "Lisa Chen",
        email: "lisa@example.com",
        tickets: [1, 23, 67],
        purchaseDate: "2024-12-19",
      },
      {
        id: 2,
        name: "David Kim",
        email: "david@example.com",
        tickets: [2, 45, 89],
        purchaseDate: "2024-12-20",
      },
      {
        id: 3,
        name: "Anna Martinez",
        email: "anna@example.com",
        tickets: [3, 78, 123],
        purchaseDate: "2024-12-21",
      },
    ],
  },
  {
    id: 3,
    title: "Emergency Medical Fund",
    description: "Support for family facing medical emergency",
    category: "Medical",
    goal: 25000,
    raised: 25000,
    ticketPrice: 25,
    endDate: "2024-12-15",
    status: "completed",
    totalTickets: 1000,
    soldTickets: 1000,
    winner: {
      name: "Robert Taylor",
      email: "robert@example.com",
      ticketNumber: 456,
    },
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://rafflesforgood.com/raffle/3",
    participants: [
      {
        id: 1,
        name: "Robert Taylor",
        email: "robert@example.com",
        tickets: [456, 123, 789],
        purchaseDate: "2024-12-10",
      },
      {
        id: 2,
        name: "Jane Davis",
        email: "jane@example.com",
        tickets: [12, 345, 678],
        purchaseDate: "2024-12-11",
      },
      {
        id: 3,
        name: "Tom Wilson",
        email: "tom@example.com",
        tickets: [234, 567, 890],
        purchaseDate: "2024-12-12",
      },
    ],
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check authentication
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const email = localStorage.getItem("userEmail");

    if (!userToken) {
      router.push("/signin");
      return;
    }

    setIsAuthenticated(true);
    setUserEmail(email || "user@example.com");
  }, [router]);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Raffle Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back! Manage your raffles and track participant entries.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Logged in as: {userEmail}
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Raffles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRaffles.length}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {userRaffles
                      .reduce((sum, raffle) => sum + raffle.raised, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Raffles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRaffles.filter((r) => r.status === "active").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRaffles.reduce(
                      (sum, raffle) => sum + raffle.participants.length,
                      0
                    )}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Raffles Management */}
        <div className="space-y-8">
          {userRaffles.map((raffle) => (
            <Card
              key={raffle.id}
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {raffle.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">{raffle.description}</p>

                    <div className="flex items-center gap-4 mb-4">
                      {getStatusBadge(raffle.status)}
                      <Badge className="bg-gray-100 text-gray-700">
                        {raffle.category}
                      </Badge>
                      {raffle.status === "active" && (
                        <Badge className="bg-orange-100 text-orange-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {getDaysLeft(raffle.endDate)} days left
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Raised ${raffle.raised.toLocaleString()}</span>
                        <span>Goal ${raffle.goal.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(raffle.raised / raffle.goal) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{raffle.soldTickets} tickets sold</span>
                        <span>
                          {((raffle.raised / raffle.goal) * 100).toFixed(1)}%
                          funded
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 ml-6">
                    <Image
                      src={raffle.qrCode}
                      alt={`QR Code for ${raffle.title}`}
                      width={96}
                      height={96}
                      className="border rounded-lg"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDownloadQR(raffle.qrCode, raffle.title)
                        }
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleShareRaffle(raffle.id, raffle.title)
                        }
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="participants" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="participants">
                      Participants ({raffle.participants.length})
                    </TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="participants" className="mt-6">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Participant</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Ticket Numbers</TableHead>
                            <TableHead>Purchase Date</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {raffle.participants.map((participant) => (
                            <TableRow key={participant.id}>
                              <TableCell className="font-medium">
                                {participant.name}
                                {raffle.winner?.email === participant.email && (
                                  <Badge className="ml-2 bg-yellow-100 text-yellow-700">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    Winner
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {participant.email}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {participant.tickets.map((ticket) => (
                                    <Badge
                                      key={ticket}
                                      variant="outline"
                                      className={`text-xs ${
                                        raffle.winner?.ticketNumber === ticket
                                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                          : ""
                                      }`}
                                    >
                                      #{ticket}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {new Date(
                                  participant.purchaseDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                $
                                {(
                                  participant.tickets.length *
                                  raffle.ticketPrice
                                ).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Financial Overview
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Ticket Price:
                              </span>
                              <span className="font-medium">
                                ${raffle.ticketPrice}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tickets Sold:
                              </span>
                              <span className="font-medium">
                                {raffle.soldTickets}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Total Tickets:
                              </span>
                              <span className="font-medium">
                                {raffle.totalTickets}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Revenue:</span>
                              <span className="font-medium">
                                ${raffle.raised.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Raffle Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">End Date:</span>
                              <span className="font-medium">
                                {new Date(raffle.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className="font-medium">
                                {raffle.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Category:</span>
                              <span className="font-medium">
                                {raffle.category}
                              </span>
                            </div>
                            {raffle.winner && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Winner:</span>
                                <span className="font-medium">
                                  {raffle.winner.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-6">
                    <div className="flex flex-wrap gap-4">
                      <Link href={`/campaign/${raffle.id}`}>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Public Page
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleShareRaffle(raffle.id, raffle.title)
                        }
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Raffle
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          handleDownloadQR(raffle.qrCode, raffle.title)
                        }
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>

                      {raffle.status === "active" && (
                        <Button variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Edit Raffle
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create New Raffle CTA */}
        <Card className="border-0 bg-gradient-to-r from-green-600 to-blue-600 text-white mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Create Another Raffle?
            </h3>
            <p className="text-green-100 mb-6">
              Start a new raffle and help more people support your cause.
            </p>
            <Link href="/start-raffle">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Target className="w-5 h-5 mr-2" />
                Create New Raffle
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
