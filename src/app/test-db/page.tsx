"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { raffleOperations } from "@/lib/database-helpers";

export default function TestDB() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("Testing database connection...");

      // Try to fetch active raffles
      const raffles = await raffleOperations.getActiveRaffles();

      console.log("Database test successful:", raffles);
      setResult(`Success! Found ${raffles.length} active raffles`);
    } catch (error) {
      console.error("Database test failed:", error);
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      <Button onClick={testDatabase} disabled={loading}>
        {loading ? "Testing..." : "Test Database"}
      </Button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
