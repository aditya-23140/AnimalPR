"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CirclesBackground from "@/components/background";
import { animalBreeds, animalCategories } from "@/components/AnimalTypes";

export default function AddPetForm() {
  const [pet, setPet] = useState({
    id: null,
    name: "",
    category: "",
    type: "",
    breed: "",
    photos: [],
    isPublic: false,
    additionalInfo: {
      weight: "",
      height: "",
      subNotes: [],
    },
    subNote: "", // Temporary value for the sub-note input
  });
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  useEffect(() => {
    // Check if there's pet data in localStorage
    const storedPetData = localStorage.getItem("petEditData");
    if (storedPetData) {
      const parsedData = JSON.parse(storedPetData);
      setPet(parsedData);
      localStorage.removeItem("petEditData"); // Remove data after loading it
    }
  }, []);

  const handleChange = (field, value) => {
    if (field === "additionalInfo") {
      setPet({ ...pet, additionalInfo: value });
    } else {
      setPet({ ...pet, [field]: value });
    }
  };

  const handleFileChange = (files) => {
    setPet({ ...pet, photos: Array.from(files) });
  };

  const togglePublic = () => {
    setPet({ ...pet, isPublic: !pet.isPublic });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("name", pet.name);
    formData.append("category", pet.category);
    formData.append("type", pet.type);
    formData.append("breed", pet.breed);
    formData.append("isPublic", pet.isPublic);
    formData.append("additionalInfo", JSON.stringify(pet.additionalInfo)); // Send additionalInfo as a stringified object

    pet.photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      // If pet.id exists, it means we are editing. Otherwise, we are adding.
      const url = pet.id
        ? `http://localhost:8000/api/auth/pets/${pet.id}/edit/` // Edit request URL
        : "http://localhost:8000/api/auth/pets/add/"; // Add request URL

      const response = await fetch(url, {
        method: pet.id ? "PUT" : "POST", // PUT for editing, POST for creating
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error response:", text);
      } else {
        const data = await response.json();
        console.log("Pet saved successfully", data);
        window.location.href = "/user"; // Redirect after successful creation or update
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <>
      <CirclesBackground height={window.innerHeight} />
      <div className="min-h-screen bg-[#0b101a] flex flex-col justify-start">
        <Navbar />
        <div className="w-full py-6 px-4 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            {pet.id ? "Edit Pet" : "Add Pet"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-semibold">
                Pet Name
              </label>
              <input
                type="text"
                id="name"
                value={pet.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-lg font-semibold">
                Pet Category
              </label>
              <select
                id="category"
                value={pet.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                required
              >
                <option value="">Select a category</option>
                {animalCategories &&
                  Array.isArray(animalCategories) &&
                  animalCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            {/* Type */}
            <div className="mb-4">
              <label htmlFor="type" className="block text-lg font-semibold">
                Pet Type
              </label>
              <select
                id="type"
                value={pet.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                required
              >
                <option value="">Select a type</option>
                {animalBreeds[pet.category]?.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Breed */}
            <div className="mb-4">
              <label htmlFor="breed" className="block text-lg font-semibold">
                Pet Breed
              </label>
              <input
                type="text"
                id="breed"
                value={pet.breed}
                onChange={(e) => handleChange("breed", e.target.value)}
                className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
              />
            </div>

            {/* Is Public */}
            <div className="mb-4">
              <label className="block text-lg font-semibold">
                Is Pet Public?
              </label>
              <button
                type="button"
                onClick={togglePublic}
                className={`w-full p-3 mt-2 ${
                  pet.isPublic ? "bg-green-500" : "bg-red-500"
                } border-2 rounded-lg`}
              >
                {pet.isPublic ? "Public" : "Private"}
              </button>
            </div>

            {/* Sub Notes */}
            {showAdditionalInfo && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Additional Info</h3>
                <div className="mt-2">
                  <label
                    htmlFor="weight"
                    className="block text-md font-semibold"
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    value={pet.additionalInfo.weight}
                    onChange={(e) =>
                      handleChange("additionalInfo", {
                        ...pet.additionalInfo,
                        weight: e.target.value,
                      })
                    }
                    className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="height"
                    className="block text-md font-semibold"
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id="height"
                    value={pet.additionalInfo.height}
                    onChange={(e) =>
                      handleChange("additionalInfo", {
                        ...pet.additionalInfo,
                        height: e.target.value,
                      })
                    }
                    className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="subNote"
                    className="block text-md font-semibold"
                  >
                    Add Sub Note
                  </label>
                  <input
                    type="text"
                    id="subNote"
                    value={pet.subNote}
                    onChange={(e) =>
                      setPet({ ...pet, subNote: e.target.value })
                    }
                    className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pet.subNote) {
                        handleChange("additionalInfo", {
                          ...pet.additionalInfo,
                          subNotes: [
                            ...pet.additionalInfo.subNotes,
                            pet.subNote,
                          ],
                        });
                        setPet({ ...pet, subNote: "" });
                      }
                    }}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    Add Sub Note
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="photos" className="block text-lg font-semibold">
                Pet Photos
              </label>
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="w-full p-3 mt-2 bg-gray-800 border-2 rounded-lg"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {pet.id ? "Update Pet" : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
}
