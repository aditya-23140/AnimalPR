"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CirclesBackground from "@/components/background";
import Image from "next/image";

export default function SearchPetForm() {
  const [files, setFiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const BACKEND_API_PORT = process.env.NEXT_PUBLIC_BACKEND_API_PORT;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        `${BACKEND_API_PORT}/api/auth/pets/search/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
        alert("Failed to search for pets. Please try again.");
      } else {
        const data = await response.json();
        setMatches(data.matches || []);
        console.log("Search results:", data);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CirclesBackground height={window.innerHeight} />
      <div className="min-h-screen bg-[var(--background)] flex flex-col justify-start overflow-hidden">
        <Navbar />

        <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-auto">
          <div className="max-w-lg w-full bg-[var(--background2)] rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-500 ease-in-out">
            <div className="px-6 py-8 sm:px-10 sm:py-12">
              <h1 className="text-center text-3xl font-extrabold text-[var(--textColor)] mb-6 tracking-tight hover:tracking-wide transition-all duration-300">
                Search for a Pet
              </h1>

              <form
                id="searchForm"
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="images"
                      className="block text-sm font-semibold text-[var(--textColor2)] mb-1"
                    >
                      Upload Photos
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="images"
                        className="flex items-center justify-center px-4 py-2 bg-[var(--primaryColor)] text-[var(--textColor3)] font-bold rounded-lg cursor-pointer hover:bg-[var(--primary1)] hover:text-[var(--textColor3)] hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        {files.length > 0
                          ? `${files.length} file(s) selected`
                          : "Choose Files"}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[var(--primaryColor)] text-[var(--textColor3)] p-3 rounded-lg font-bold hover:bg-[var(--primary1)] hover:text-[var(--textColor3)] transition duration-300 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </button>
                </div>
              </form>

              {/* Display search results */}
              {matches.length > 0
                ? matches.map((match, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[var(--backgroundColor)] rounded-lg shadow-md mt-4 flex justify-between items-center"
                    >
                      <div className="details">
                        <h3 className="text-lg font-semibold text-[var(--textColor)]">
                          {match.pet_details.name}
                        </h3>
                        <p className="text-sm text-[var(--textColor2)]">
                          Type: {match.pet_details.type}
                        </p>
                        <p className="text-sm text-[var(--textColor2)]">
                          Breed: {match.pet_details.breed}
                        </p>
                        <p className="text-sm text-[var(--textColor2)]">
                          Similarity: {(match.similarity * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div className="images">
                        {match.pet_details.images?.length > 0 && (
                          <div className="mt-2 relative">
                            {match.pet_details.images.map((image, idx) => (
                              <Image
                                key={idx}
                                width={100}
                                height={100}
                                src={`http://localhost:8000/media/${image}`}
                                alt={`Pet image ${idx + 1}`}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : searchPerformed && (
                    <p className="text-center text-[var(--primaryColor)] font-bold bg-[var(--backgroundColor)] p-3 rounded-lg mt-4">
                      ⚠️ No similar pet found. Try again with different images.
                    </p>
                  )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
