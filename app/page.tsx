"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Item = {
  id: number;
  name: string;
  price: number;
  count: number;
};

const HomePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null); // State for delete confirmation

  // Fetch all items from the API
  const fetchItems = async () => {
    try {
      const url = "http://localhost:8787/api/items";
      console.log("Fetching data from:", url);

      const res = await fetch(url);
      const data = await res.json();

      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle item deletion
  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      const response = await fetch(
        `http://localhost:8787/api/items/${deleteItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setItems(items.filter((item) => item.id !== deleteItemId)); // Remove item from UI
        setDeleteItemId(null); // Close dialog
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {/* Top Section with Title and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">📦 Items List</h1>
        <Link href="/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md">
            ➕ Create New Item
          </Button>
        </Link>
      </div>

      <p className="text-gray-600 mb-8 text-lg">
        Welcome to the full-stack CRUD application! Manage your items easily.
      </p>

      {/* Loading State */}
      {loading && <p className="text-center text-lg">⏳ Loading items...</p>}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <Card
              key={item.id}
              className="relative shadow-lg hover:shadow-2xl transition p-5 rounded-lg border border-gray-200"
            >
              {/* Card Header with Edit Button Positioned in the Top-Right */}
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                <Link href={`/edit/${item.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-100"
                  >
                    ✏️ Edit
                  </Button>
                </Link>
              </div>

              <CardContent className="mt-3 text-lg">
                <p className="text-gray-700">
                  <strong>💲 Price:</strong> ${item.price}
                </p>
                <p className="text-gray-700">
                  <strong>📦 Count:</strong> {item.count}
                </p>
              </CardContent>

              {/* Delete Button at Bottom-Right */}
              <div className="flex justify-end mt-5">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteItemId(item.id)}
                  className="px-4 py-2"
                >
                   Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-lg">
            🚫 No items available
          </p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteItemId !== null}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <DialogContent className="p-6 max-w-md rounded-lg shadow-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold text-red-600">
              ⚠️ Confirm Deletion
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              This action! <strong>cannot be undone.</strong> Are you sure you want to delete this item?
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteItemId(null)}
              className="w-28 border-gray-500 text-gray-700"
            >
               Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-28 bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
