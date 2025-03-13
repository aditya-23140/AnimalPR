"use client";

import { useState, useEffect } from "react";
import { ImageGrid } from "@/components/ImageGrid";
import { Sidebar } from "@/components/Sidebar";
import Navbar from "@/components/navbar";

const categories = [
  { id: "Dogs", name: "Dogs" },
  { id: "Cats", name: "Cats" },
  { id: "Cattle", name: "Cattle" },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  return (
    <div className="dark bg-[--c3] text-white min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-24">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <main className="flex-1 overflow-y-auto p-6 h-[82vh] scroll-smooth bg-[var(--background)] z-10">
          <h1 className="text-3xl font-bold mb-6 text-[var(--secondaryColor)]">
            {categories.find((cat) => cat.id === selectedCategory)?.name} Images
          </h1>
          <ImageGrid category={selectedCategory} />
        </main>
      </div>
    </div>
  );
}
