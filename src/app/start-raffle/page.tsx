"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const raffleSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  goal: z.number().min(100, "Goal must be at least $100"),
  ticketPrice: z.number().min(1, "Ticket price must be at least $1"),
  category: z.enum(["Medical", "Pets", "Emergency", "Education"]),
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerEmail: z.string().email("Valid email is required"),
  endDate: z.string().min(1, "End date is required"),
  image: z.string().optional(),
});

type RaffleFormData = z.infer<typeof raffleSchema>;

export default function StartRaffle() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RaffleFormData>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      title: "",
      description: "",
      goal: 1000,
      ticketPrice: 10,
      category: "Medical",
      organizerName: "",
      organizerEmail: "",
      endDate: "",
      image: "",
    },
  });

  const onSubmit = (data: RaffleFormData) => {
    // Check if user is authenticated before submitting
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      // Redirect to signin page if not authenticated
      router.push("/signin");
      return;
    }

    console.log("Raffle submission:", data);
    toast("Raffle Created Successfully!", {
      description:
        "Your raffle has been submitted for review and will be live shortly.",
    });

    // Navigate back to home page after successful submission
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const categories = [
    {
      name: "Medical",
      color: "bg-red-100 text-red-700",
      description: "Medical treatments and healthcare",
    },
    {
      name: "Pets",
      color: "bg-blue-100 text-blue-700",
      description: "Animal care and veterinary needs",
    },
    {
      name: "Emergency",
      color: "bg-orange-100 text-orange-700",
      description: "Urgent assistance and relief",
    },
    {
      name: "Education",
      color: "bg-green-100 text-green-700",
      description: "Educational support and scholarships",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Start Your
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
              Raffle for Good
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a transparent, fair raffle to raise funds for your cause.
            Help your community support what matters most.
          </p>
        </div>

        {/* Form */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Your Raffle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raffle Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Help Luna Get Life-Saving Surgery"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell your story. Explain why this cause is important and how the funds will be used..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categories.map((category) => (
                            <div
                              key={category.name}
                              onClick={() => field.onChange(category.name)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                field.value === category.name
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Badge className={category.color}>
                                {category.name}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-2">
                                {category.description}
                              </p>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Financial Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Financial Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fundraising Goal ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="1000"
                                className="pl-10"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ticketPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                placeholder="10"
                                className="pl-10"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input type="date" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Organizer Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Organizer Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name / Organization</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe / Animal Rescue Foundation"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Raffle Image (Optional)
                  </h3>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Add a compelling image to help tell your story
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Creating Raffle..."
                      : "Create Raffle"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-8 border-0 bg-blue-50/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">
              Raffle Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • All raffles are reviewed before going live to ensure they meet
                our community standards
              </li>
              <li>• Be transparent about how funds will be used</li>
              <li>
                • Provide regular updates to supporters throughout your campaign
              </li>
              <li>
                • Winners are drawn fairly using our transparent random
                selection system
              </li>
              <li>
                • 5% platform fee applies to all successful raffles to maintain
                the service
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
