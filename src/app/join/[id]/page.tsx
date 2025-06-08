"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Clock,
  Users,
  DollarSign,
  Phone,
  User,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { raffleOperations, ticketOperations } from "@/lib/database-helpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Database } from "@/lib/supabase";

type Raffle = Database["public"]["Tables"]["raffles"]["Row"];

const participationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  ticketCount: z
    .number()
    .min(1, "Must purchase at least 1 ticket")
    .max(10, "Maximum 10 tickets per purchase"),
});

type ParticipationFormData = z.infer<typeof participationSchema>;

export default function JoinRaffle() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ParticipationFormData>({
    resolver: zodResolver(participationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      ticketCount: 1,
    },
  });

  const raffleId = params.id as string;
  const ticketCount = form.watch("ticketCount");

  useEffect(() => {
    const loadRaffle = async () => {
      try {
        const raffleData = await raffleOperations.getRaffleById(raffleId);
        setRaffle(raffleData);
      } catch (error) {
        console.error("Error loading raffle:", error);
        toast("Error", {
          description: "Could not load raffle details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (raffleId) {
      loadRaffle();
    }
  }, [raffleId, toast]);

  const onSubmit = async (data: ParticipationFormData) => {
    if (!raffle) return;

    setSubmitting(true);

    try {
      // Get next available ticket numbers
      const ticketNumbers = await ticketOperations.getNextTicketNumbers(
        raffleId,
        data.ticketCount
      );

      // Create tickets for purchase
      const tickets = ticketNumbers.map((ticketNumber) => ({
        raffle_id: raffleId,
        participant_email: data.email,
        participant_name: data.name,
        ticket_number: ticketNumber,
        payment_amount: raffle.ticket_price,
        payment_status: "completed" as const, // In real app, this would be "pending" until payment succeeds
      }));

      // Purchase tickets
      await ticketOperations.purchaseTickets(tickets);

      toast("Tickets Purchased Successfully!", {
        description: `You&apos;ve purchased ${data.ticketCount} ticket${
          data.ticketCount > 1 ? "s" : ""
        } for ${raffle.title}. Good luck!`,
      });

      // Redirect to a success page or back to the raffle
      setTimeout(() => {
        router.push(`/campaign/${raffleId}`);
      }, 2000);
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      toast("Purchase Failed", {
        description:
          "There was an error processing your purchase. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-custom-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-custom-text">Loading raffle details...</p>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-custom-text mb-4">
            Raffle Not Found
          </h1>
          <p className="text-custom-text/70 mb-6">
            The raffle you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-custom-button hover:bg-custom-button/90 text-custom-text"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const totalAmount = (raffle.ticket_price * ticketCount).toFixed(2);
  const progressPercentage = (raffle.raised_amount / raffle.goal_amount) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-custom-bg/10 border-b border-custom-bg/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-6 w-6 text-custom-button" />
            <span className="text-lg font-bold text-custom-text">
              RafflesForGood
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-custom-text">
            Join the Raffle
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Raffle Info */}
          <div>
            <Card className="shadow-custom border-0">
              <CardContent className="p-6">
                {raffle.image_url && (
                  <img
                    src={raffle.image_url}
                    alt={raffle.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-custom-button/20 text-custom-text">
                    {raffle.category}
                  </Badge>
                  <span className="text-sm text-custom-text/70">
                    by {raffle.organizer_name}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-custom-text mb-3">
                  {raffle.title}
                </h2>

                <p className="text-custom-text/80 mb-4 line-clamp-3">
                  {raffle.description}
                </p>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-custom-text/70">Progress</span>
                    <span className="text-custom-text font-medium">
                      ${raffle.raised_amount.toLocaleString()} / $
                      {raffle.goal_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-custom-bg/30 rounded-full h-2">
                    <div
                      className="bg-custom-button h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-custom-text/60">
                    {progressPercentage.toFixed(1)}% funded
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="h-4 w-4 text-custom-button mr-1" />
                      <span className="text-lg font-bold text-custom-text">
                        ${raffle.ticket_price}
                      </span>
                    </div>
                    <p className="text-xs text-custom-text/70">per ticket</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-custom-button mr-1" />
                      <span className="text-lg font-bold text-custom-text">
                        {raffle.tickets_sold}
                      </span>
                    </div>
                    <p className="text-xs text-custom-text/70">tickets sold</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-custom-button mr-1" />
                      <span className="text-lg font-bold text-custom-text">
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(raffle.end_date).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-custom-text/70">days left</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Form */}
          <div>
            <Card className="shadow-custom border-0">
              <CardHeader>
                <CardTitle className="text-xl text-custom-text">
                  Purchase Tickets
                </CardTitle>
                <p className="text-sm text-custom-text/70">
                  Fill in your details to join this raffle
                </p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-custom-text">
                      Full Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10 border-custom-text/30"
                        {...form.register("name")}
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-custom-text">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 border-custom-text/30"
                        {...form.register("email")}
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-custom-text">
                      Phone Number
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-custom-text/60" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10 border-custom-text/30"
                        {...form.register("phone")}
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Ticket Count */}
                  <div>
                    <Label htmlFor="ticketCount" className="text-custom-text">
                      Number of Tickets
                    </Label>
                    <div className="flex items-center space-x-3 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          form.setValue(
                            "ticketCount",
                            Math.max(1, ticketCount - 1)
                          )
                        }
                        disabled={ticketCount <= 1}
                        className="border-custom-text/30"
                      >
                        -
                      </Button>
                      <Input
                        id="ticketCount"
                        type="number"
                        min="1"
                        max="10"
                        className="text-center border-custom-text/30 w-20"
                        {...form.register("ticketCount", {
                          valueAsNumber: true,
                        })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          form.setValue(
                            "ticketCount",
                            Math.min(10, ticketCount + 1)
                          )
                        }
                        disabled={ticketCount >= 10}
                        className="border-custom-text/30"
                      >
                        +
                      </Button>
                    </div>
                    {form.formState.errors.ticketCount && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.ticketCount.message}
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="bg-custom-bg/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-custom-text font-medium">
                        Total Amount:
                      </span>
                      <span className="text-xl font-bold text-custom-text">
                        ${totalAmount}
                      </span>
                    </div>
                    <p className="text-xs text-custom-text/60 mt-1">
                      {ticketCount} ticket{ticketCount > 1 ? "s" : ""} × $
                      {raffle.ticket_price}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text py-3 text-lg shadow-custom"
                  >
                    {submitting
                      ? "Processing..."
                      : `Purchase ${ticketCount} Ticket${
                          ticketCount > 1 ? "s" : ""
                        }`}
                  </Button>

                  <p className="text-xs text-custom-text/60 text-center">
                    By purchasing, you agree to our terms and conditions.
                    Payment is processed securely.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
