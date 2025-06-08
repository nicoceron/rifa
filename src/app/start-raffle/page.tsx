"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, DollarSign, Upload, X, Gift } from "lucide-react";
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
import { useAuth } from "@/lib/auth-context";
import { raffleOperations, fileOperations } from "@/lib/database-helpers";

const raffleSchema = z
  .object({
    title: z
      .string()
      .min(10, "Title must be at least 10 characters")
      .max(80, "Title must be less than 80 characters"),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters")
      .max(500, "Description must be less than 500 characters"),
    prizeType: z.enum(["money", "item"], {
      required_error: "Please select a prize type",
    }),
    goal: z.number().min(100, "Goal must be at least $100"),
    prizeDescription: z.string().optional(),
    ticketPrice: z.number().min(1, "Ticket price must be at least $1"),
    category: z.enum(["Medical", "Pets", "Emergency", "Education"]),
    organizerName: z.string().min(2, "Organizer name is required"),
    organizerEmail: z.string().email("Valid email is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (
        data.prizeType === "item" &&
        (!data.prizeDescription || data.prizeDescription.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Prize description is required when offering an item or service",
      path: ["prizeDescription"],
    }
  );

type RaffleFormData = z.infer<typeof raffleSchema>;

export default function StartRaffle() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<RaffleFormData>({
    resolver: zodResolver(raffleSchema),
    defaultValues: {
      title: "",
      description: "",
      prizeType: "money",
      goal: 1000,
      prizeDescription: "",
      ticketPrice: 10,
      category: "Medical",
      organizerName: profile?.full_name || "",
      organizerEmail: user?.email || "",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now in YYYY-MM-DD format
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast("Invalid File Type", {
          description: "Please select an image file (JPG, PNG, etc.)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast("File Too Large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const onSubmit = async (data: RaffleFormData) => {
    // Check if user is authenticated before submitting
    if (!user) {
      toast("Authentication Required", {
        description: "Please sign in to create a raffle.",
      });
      router.push("/signin");
      return;
    }

    try {
      console.log("Starting raffle creation with data:", data);

      // Validate end date format
      if (!data.endDate || data.endDate === "") {
        toast("End Date Required", {
          description: "Please select an end date for your raffle.",
        });
        return;
      }

      // Calculate end date
      console.log("Raw end date from form:", data.endDate);
      const endDate = new Date(data.endDate);
      console.log("Parsed end date:", endDate);

      // Check if date is valid
      if (isNaN(endDate.getTime())) {
        toast("Invalid End Date Format", {
          description: "Please enter a valid end date.",
        });
        return;
      }

      // Validate end date is in the future
      if (endDate <= new Date()) {
        toast("Invalid End Date", {
          description: "End date must be in the future.",
        });
        return;
      }

      // Handle image upload
      let imageUrl = "/placeholder-image.jpg"; // Default placeholder

      if (selectedFile) {
        try {
          console.log("Uploading image...");
          toast("Uploading Image", {
            description: "Please wait while we upload your image...",
          });

          imageUrl = await fileOperations.uploadImage(
            selectedFile,
            `raffle-${user.id}`
          );
          console.log("Image uploaded successfully:", imageUrl);

          toast("Image Uploaded", {
            description: "Your image has been uploaded successfully!",
          });
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast("Image Upload Failed", {
            description: "Failed to upload image. Using placeholder instead.",
          });
          // Continue with placeholder image - don't let upload failure block raffle creation
          imageUrl = "/placeholder-image.jpg";
        }
      }

      // Create raffle data object
      const raffleData = {
        title: data.title,
        description: data.description,
        image_url: imageUrl,
        goal_amount: data.goal,
        ticket_price: data.ticketPrice,
        tickets_total: Math.ceil(data.goal / data.ticketPrice), // Calculate based on goal and price
        category: data.category,
        organizer_id: user.id,
        organizer_name: data.organizerName,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        prize_type: data.prizeType,
        prize_description:
          data.prizeType === "item" ? data.prizeDescription : null,
      };

      console.log("Creating raffle with data:", raffleData);

      // Create raffle using Supabase
      let newRaffle;
      try {
        newRaffle = await raffleOperations.createRaffle(raffleData);
        console.log("Raffle created successfully:", newRaffle);
      } catch (dbError) {
        console.error("Database error creating raffle:", dbError);
        throw new Error(
          `Database error: ${
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error"
          }`
        );
      }

      toast("Raffle Created Successfully!", {
        description: "Your raffle has been created and is now live.",
      });

      // Navigate to the new raffle page
      setTimeout(() => {
        router.push(`/campaign/${newRaffle.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating raffle:", error);

      // More detailed error handling
      let errorMessage =
        "There was an error creating your raffle. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = String(error.message);
      }

      toast("Error Creating Raffle", {
        description: errorMessage,
      });
    }
  };

  const categories = [
    {
      name: "Medical",
      color: "bg-custom-button/20 text-custom-text",
      description: "Medical treatments and healthcare",
    },
    {
      name: "Pets",
      color: "bg-custom-button/20 text-custom-text",
      description: "Animal care and veterinary needs",
    },
    {
      name: "Emergency",
      color: "bg-custom-button/20 text-custom-text",
      description: "Urgent assistance and relief",
    },
    {
      name: "Education",
      color: "bg-custom-button/20 text-custom-text",
      description: "Educational support and scholarships",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-custom-text mb-4">
            Start Your Raffle
          </h1>
          <p className="text-xl text-custom-text/70 max-w-2xl mx-auto">
            Create a meaningful raffle campaign to raise funds for your cause.
            Every ticket sold brings you closer to your goal.
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-custom border-0 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-custom-text">
              Campaign Details
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
                  <h3 className="text-lg font-semibold text-custom-text border-b border-custom-bg/30 pb-2">
                    Basic Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between">
                          Campaign Title
                          <span className="text-xs text-custom-text/60">
                            {field.value?.length || 0}/80
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Help Save Max the Golden Retriever"
                            maxLength={80}
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
                        <FormLabel className="flex justify-between">
                          Campaign Story
                          <span className="text-xs text-custom-text/60">
                            {field.value?.length || 0}/500
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell your story... What happened? Why do you need help? How will the funds be used?"
                            className="min-h-[120px]"
                            maxLength={500}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Selection */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((category) => (
                              <div key={category.name}>
                                <input
                                  type="radio"
                                  id={category.name}
                                  value={category.name}
                                  checked={field.value === category.name}
                                  onChange={() => field.onChange(category.name)}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={category.name}
                                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    field.value === category.name
                                      ? "border-custom-button bg-custom-button/10"
                                      : "border-custom-text/20 hover:border-custom-button/50"
                                  }`}
                                >
                                  <div className="text-center">
                                    <Badge className={category.color}>
                                      {category.name}
                                    </Badge>
                                    <p className="text-xs text-custom-text/60 mt-1">
                                      {category.description}
                                    </p>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Prize Type */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-custom-text border-b border-custom-bg/30 pb-2">
                    Prize Type
                  </h3>

                  <FormField
                    control={form.control}
                    name="prizeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What will the winner receive?</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <input
                                type="radio"
                                id="money"
                                value="money"
                                checked={field.value === "money"}
                                onChange={() => field.onChange("money")}
                                className="sr-only"
                              />
                              <label
                                htmlFor="money"
                                className={`block p-6 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "money"
                                    ? "border-custom-button bg-custom-button/10"
                                    : "border-custom-text/20 hover:border-custom-button/50"
                                }`}
                              >
                                <div className="text-center">
                                  <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600" />
                                  <h4 className="font-semibold text-custom-text mb-2">
                                    Prize Money
                                  </h4>
                                  <p className="text-sm text-custom-text/60">
                                    Winner receives a portion of the funds
                                    raised
                                  </p>
                                </div>
                              </label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                id="item"
                                value="item"
                                checked={field.value === "item"}
                                onChange={() => field.onChange("item")}
                                className="sr-only"
                              />
                              <label
                                htmlFor="item"
                                className={`block p-6 rounded-lg border-2 cursor-pointer transition-all ${
                                  field.value === "item"
                                    ? "border-custom-button bg-custom-button/10"
                                    : "border-custom-text/20 hover:border-custom-button/50"
                                }`}
                              >
                                <div className="text-center">
                                  <Gift className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                                  <h4 className="font-semibold text-custom-text mb-2">
                                    Object/Service
                                  </h4>
                                  <p className="text-sm text-custom-text/60">
                                    Winner receives a specific item or service
                                  </p>
                                </div>
                              </label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Prize Description for Items/Services */}
                  {form.watch("prizeType") === "item" && (
                    <FormField
                      control={form.control}
                      name="prizeDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prize Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what the winner will receive (e.g., Professional photography session, Handmade artwork, Spa treatment, etc.)"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Financial Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-custom-text border-b border-custom-bg/30 pb-2">
                    Financial Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("prizeType") === "money"
                              ? "Fundraising Goal ($)"
                              : "Fundraising Goal ($) - Optional"}
                          </FormLabel>
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
                          {form.watch("prizeType") === "item" && (
                            <p className="text-xs text-custom-text/60">
                              For item/service prizes, this represents the value
                              of your cause, not the prize value
                            </p>
                          )}
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
                  <h3 className="text-lg font-semibold text-custom-text border-b border-custom-bg/30 pb-2">
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
                  <h3 className="text-lg font-semibold text-custom-text border-b border-custom-bg/30 pb-2">
                    Campaign Image (Optional)
                  </h3>

                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-custom-text/30 rounded-lg p-6">
                      {!selectedFile ? (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-custom-text/40 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-custom-text mb-2">
                            Upload an image
                          </h4>
                          <p className="text-sm text-custom-text/60 mb-4">
                            Choose a compelling image to help tell your story
                            (JPG, PNG - Max 5MB)
                          </p>
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-custom-text/30 text-custom-text hover:bg-custom-button/10"
                              asChild
                            >
                              <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Image Preview */}
                          <div className="relative">
                            {filePreview && (
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={removeFile}
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-custom-text">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-custom-text/60">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-custom-text/60">
                      If no image is uploaded, a placeholder image will be used
                      for your campaign.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-custom-button hover:bg-custom-button/90 text-custom-text text-lg py-6 shadow-custom"
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
        <Card className="mt-8 border-0 bg-custom-bg/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-custom-text mb-4">
              Raffle Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-custom-text/80">
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
