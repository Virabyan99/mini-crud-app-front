"use client";

export const runtime = 'edge';


import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Get the ID from the URL
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EditItemPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Get ID from the dynamic route

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch item data by ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:8787/api/items/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch item data.");
        }
        const data = await res.json();

        setName(data.item.name);
        setPrice(data.item.price.toString());
        setCount(data.item.count.toString());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  // Handle Update
  const handleUpdateItem = async () => {
    setLoading(true);
    setError("");

    // Validate Inputs
    if (!name || !price || !count) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8787/api/items/${id}`, {
        method: "PUT",
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
        throw new Error("Failed to update item.");
      }

      // Redirect to home page after update
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
          <CardTitle className="text-xl font-semibold">Edit Item</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {loading && <p className="text-center">Loading...</p>}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Form Fields */}
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

          {/* Update Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleUpdateItem}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Item"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditItemPage;
