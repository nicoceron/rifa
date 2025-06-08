import { supabase } from "./supabase";
import type { Database } from "./supabase";

type Tables = Database["public"]["Tables"];

// File upload operations
export const fileOperations = {
  // Ensure the images bucket exists
  async ensureBucket() {
    try {
      const { data: buckets, error: listError } =
        await supabase.storage.listBuckets();

      if (listError) {
        console.warn("Could not list buckets:", listError);
        return; // Don't block upload if we can't list buckets
      }

      const bucketExists = buckets?.some(
        (bucket) => bucket.name === "raffle-image"
      );

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(
          "raffle-image",
          {
            public: true,
            allowedMimeTypes: ["image/*"],
            fileSizeLimit: "5MB",
          }
        );

        if (createError) {
          console.warn(
            "Could not create bucket (may already exist):",
            createError
          );
          // Don't throw - bucket might already exist from another session
        }
      }
    } catch (error) {
      console.warn("Bucket setup failed, continuing anyway:", error);
      // Don't throw - we'll try the upload anyway
    }
  },

  // Upload image to Supabase storage
  async uploadImage(file: File, path: string) {
    // Ensure bucket exists (with timeout)
    const bucketPromise = this.ensureBucket();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Bucket setup timeout")), 10000)
    );

    try {
      await Promise.race([bucketPromise, timeoutPromise]);
    } catch (error) {
      console.warn(
        "Bucket setup failed or timed out, trying upload anyway:",
        error
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `raffle-images/${fileName}`;

    // Upload with timeout
    const uploadPromise = supabase.storage
      .from("raffle-image")
      .upload(filePath, file);

    const uploadTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), 30000)
    );

    const result = (await Promise.race([
      uploadPromise,
      uploadTimeoutPromise,
    ])) as { error: Error | null };

    const { error: uploadError } = result;

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("raffle-image")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Delete image from storage
  async deleteImage(url: string) {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `raffle-images/${fileName}`;

    const { error } = await supabase.storage
      .from("raffle-image")
      .remove([filePath]);

    if (error) throw error;
  },
};

// Raffle operations
export const raffleOperations = {
  // Get all active raffles
  async getActiveRaffles() {
    const { data, error } = await supabase
      .from("raffles")
      .select(
        `
        *,
        profiles!raffles_organizer_id_fkey(full_name, avatar_url)
      `
      )
      .eq("status", "active")
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get raffle by ID
  async getRaffleById(id: string) {
    const { data, error } = await supabase
      .from("raffles")
      .select(
        `
        *,
        profiles!raffles_organizer_id_fkey(full_name, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new raffle
  async createRaffle(raffle: Tables["raffles"]["Insert"]) {
    const { data, error } = await supabase
      .from("raffles")
      .insert([raffle])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update raffle
  async updateRaffle(id: string, updates: Tables["raffles"]["Update"]) {
    const { data, error } = await supabase
      .from("raffles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get raffles by organizer
  async getRafflesByOrganizer(organizerId: string) {
    const { data, error } = await supabase
      .from("raffles")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get raffles by category
  async getRafflesByCategory(category: string) {
    const { data, error } = await supabase
      .from("raffles")
      .select("*")
      .eq("category", category)
      .eq("status", "active")
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Ticket operations
export const ticketOperations = {
  // Purchase tickets
  async purchaseTickets(tickets: Tables["tickets"]["Insert"][]) {
    const { data, error } = await supabase
      .from("tickets")
      .insert(tickets)
      .select();

    if (error) throw error;
    return data;
  },

  // Get tickets for a raffle
  async getTicketsByRaffle(raffleId: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("raffle_id", raffleId)
      .order("ticket_number", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get tickets by participant email
  async getTicketsByEmail(email: string) {
    const { data, error } = await supabase
      .from("tickets")
      .select(
        `
        *,
        raffles(title, description, image_url, end_date)
      `
      )
      .eq("participant_email", email)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update ticket payment status
  async updateTicketPaymentStatus(
    ticketId: string,
    status: "pending" | "completed" | "failed"
  ) {
    const { data, error } = await supabase
      .from("tickets")
      .update({ payment_status: status })
      .eq("id", ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get next available ticket numbers
  async getNextTicketNumbers(raffleId: string, count: number) {
    const { data: existingTickets, error } = await supabase
      .from("tickets")
      .select("ticket_number")
      .eq("raffle_id", raffleId)
      .order("ticket_number", { ascending: true });

    if (error) throw error;

    const usedNumbers = new Set(existingTickets.map((t) => t.ticket_number));
    const availableNumbers: number[] = [];

    let number = 1;
    while (availableNumbers.length < count) {
      if (!usedNumbers.has(number)) {
        availableNumbers.push(number);
      }
      number++;
    }

    return availableNumbers;
  },
};

// Profile operations
export const profileOperations = {
  // Get profile by ID
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(id: string, updates: Tables["profiles"]["Update"]) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create profile
  async createProfile(profile: Tables["profiles"]["Insert"]) {
    const { data, error } = await supabase
      .from("profiles")
      .insert([profile])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Category operations
export const categoryOperations = {
  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get category by name
  async getCategoryByName(name: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name)
      .single();

    if (error) throw error;
    return data;
  },
};

// Statistics operations
export const statsOperations = {
  // Get raffle statistics
  async getRaffleStats(raffleId?: string) {
    if (raffleId) {
      const { data, error } = await supabase
        .from("raffle_stats")
        .select("*")
        .eq("id", raffleId)
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from("raffle_stats").select("*");

      if (error) throw error;
      return data;
    }
  },

  // Get platform statistics
  async getPlatformStats() {
    const [rafflesResult, ticketsResult, totalRaisedResult] =
      await Promise.allSettled([
        supabase.from("raffles").select("id", { count: "exact", head: true }),
        supabase
          .from("tickets")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "completed"),
        supabase.from("raffles").select("raised_amount"),
      ]);

    const totalRaffles =
      rafflesResult.status === "fulfilled" ? rafflesResult.value.count || 0 : 0;
    const totalTickets =
      ticketsResult.status === "fulfilled" ? ticketsResult.value.count || 0 : 0;

    let totalRaised = 0;
    if (
      totalRaisedResult.status === "fulfilled" &&
      totalRaisedResult.value.data
    ) {
      totalRaised = totalRaisedResult.value.data.reduce(
        (sum, raffle) => sum + (raffle.raised_amount || 0),
        0
      );
    }

    return {
      totalRaffles,
      totalTickets,
      totalRaised,
    };
  },
};

// Auth helpers
export const authHelpers = {
  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign up with email/password
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
