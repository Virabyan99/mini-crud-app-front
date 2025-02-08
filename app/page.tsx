"use client";

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';


type Item = {
  id: number;
  name: string;
  price: number;
  count: number;
};

const HomePage = () => {
  const [items, setItems] = useState<Item[]>([]); // State to store items
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch all items from the API
  const fetchItems = async () => {
    try {
      const url = "http://localhost:8787/api/items"; // Backend API endpoint
      console.log("Fetching data from:", url);
  
      const res = await fetch(url);
  
      console.log("Response status:", res.status); // Log response status
      console.log("Response headers:", res.headers); // Log headers
  
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType); // Debugging: Ensure it's JSON
  
      // ✅ Read response as text first for debugging
      const textResponse = await res.text();
      console.log("Raw response:", textResponse); // Debugging: Log raw response
  
      // ✅ Convert to JSON manually (fixes potential parsing issues)
      const data = JSON.parse(textResponse);
      
      console.log("Parsed JSON:", data); // Debugging: Log parsed JSON
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Items List</h1>
      <p>Welcome to the full-stack CRUD application!</p>

      {/* Display loading state */}
      {loading && <p>Loading items...</p>}

      {/* Display the list of items */}
      <div>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Count: {item.count}</p>
            </div>
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>

      <Button onClick={() => console.log('Button clicked!')}>Test Button</Button>
    </div>
  );
};

export default HomePage;
