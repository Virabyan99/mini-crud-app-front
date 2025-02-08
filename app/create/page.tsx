"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for redirection
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CreateItemPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateItem = async () => {
    setLoading(true);
    setError("");

    // Validate Inputs
    if (!name || !price || !count) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://mini-crud-app.gmparstone99.workers.dev/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          count: parseInt(count),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create item.");
      }

      // Redirect to home page after successful creation
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create New Item</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Name Input */}
          <div className="mb-4">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Price Input */}
          <div className="mb-4">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Count Input */}
          <div className="mb-4">
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              placeholder="Enter count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateItem}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Item"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateItemPage;
