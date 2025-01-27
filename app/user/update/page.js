"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CirclesBackground from "@/components/background";
import { animalBreeds, animalCategories } from "@/components/AnimalTypes";

export default function AddPetForm() {
  const [pet, setPet] = useState({
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
    subNote: "",
  });
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState("auto");

  const BACKEND_API_PORT = process.env.NEXT_PUBLIC_BACKEND_API_PORT;

  useEffect(() => {
    setBackgroundHeight(window.innerHeight + 300);
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
    formData.append("additionalInfo", JSON.stringify(pet.additionalInfo));

    pet.photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await fetch(`${BACKEND_API_PORT}api/auth/pets/add/`, {
        method: "POST",
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
        console.log("Pet added successfully", data);
        window.location.href = "/user";
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <>
      <CirclesBackground height={backgroundHeight} />
      <div className="min-h-screen bg-[#0b101a] flex flex-col justify-start">
        <Navbar />

        <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full bg-[#161b26] rounded-2xl shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transform transition-all hover:scale-105 duration-500 ease-in-out">
            <div className="px-10 py-12">
              <h1 className="text-center text-3xl font-extrabold text-[#fefefe] mb-6 tracking-tight hover:tracking-wide transition-all duration-300">
                Add Pet Details
              </h1>

              <form id="submitForm" className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={pet.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                      placeholder="Enter pet's name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Select Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={pet.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                      required
                    >
                      <option value="">Select Category</option>
                      {Object.keys(animalCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Select Animal Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={pet.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                      required
                    >
                      <option value="">Select Type</option>
                      {pet.category &&
                        animalCategories[pet.category].types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="breed" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Select Breed
                    </label>
                    <select
                      id="breed"
                      name="breed"
                      value={pet.breed}
                      onChange={(e) => handleChange("breed", e.target.value)}
                      className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                      required
                    >
                      <option value="">Select Breed</option>
                      {pet.type &&
                        animalBreeds[pet.type] &&
                        animalBreeds[pet.type].map((breed) => (
                          <option key={breed} value={breed}>
                            {breed}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="photos" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Upload Photos
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="photos"
                        name="photos"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor="photos"
                        className="flex items-center justify-center px-4 py-2 bg-[#3983fb] text-white font-bold rounded-lg cursor-pointer hover:bg-[#0b101a] hover:text-[#3983fb] hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        {pet.photos.length > 0
                          ? `${pet.photos.length} file(s) selected`
                          : "Choose Files"}
                      </label>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                      className="w-full bg-[#3983fb] text-white p-3 rounded-lg font-bold hover:bg-[#0b101a] hover:text-[#3983fb] transition duration-300 ease-in-out"
                    >
                      {showAdditionalInfo ? "Hide Additional Info" : "Add Additional Info"}
                    </button>
                  </div>

                  {showAdditionalInfo && (
                    <>
                      <div>
                        <label htmlFor="weight" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                          Weight
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={pet.additionalInfo.weight}
                          onChange={(e) =>
                            handleChange("additionalInfo", {
                              ...pet.additionalInfo,
                              weight: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                          placeholder="Enter pet's weight"
                        />
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                          Height
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={pet.additionalInfo.height}
                          onChange={(e) =>
                            handleChange("additionalInfo", {
                              ...pet.additionalInfo,
                              height: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                          placeholder="Enter pet's height"
                        />
                      </div>

                      <div>
                        <label htmlFor="subNote" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                          Add Sub-Note
                        </label>
                        <input
                          type="text"
                          id="subNote"
                          name="subNote"
                          className="w-full p-3 border border-[#4f545c] rounded-lg bg-[#2b2f3a] text-[#fefefe] focus:border-[#3983fb] focus:ring-[#3983fb] outline-none transition duration-150 ease-in-out"
                          placeholder="Add a sub-note"
                          value={pet.subNote}
                          onChange={(e) =>
                            setPet({
                              ...pet,
                              subNote: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSubNotes = [...pet.additionalInfo.subNotes, pet.subNote];
                            setPet({
                              ...pet,
                              additionalInfo: {
                                ...pet.additionalInfo,
                                subNotes: newSubNotes,
                              },
                              subNote: "",
                            });
                          }}
                          className="w-full bg-[#3983fb] text-white p-3 rounded-lg font-bold hover:bg-[#0b101a] hover:text-[#3983fb] transition duration-300 ease-in-out"
                        >
                          Add Sub-Note
                        </button>
                        <div>
                          {pet.additionalInfo.subNotes.length > 0 && (
                            <ul className="text-[#9ea4b0] mt-2">
                              {pet.additionalInfo.subNotes.map((note, index) => (
                                <li key={index}>{note}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="isPublic" className="block text-sm font-semibold text-[#9ea4b0] mb-1">
                      Visibility
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={pet.isPublic}
                        onChange={togglePublic}
                        className="h-5 w-5 text-[#3983fb] border border-[#4f545c] rounded focus:ring-[#3983fb] transition duration-150 ease-in-out"
                      />
                      <label htmlFor="isPublic" className="ml-2 text-sm text-[#9ea4b0]">
                        Make photos public
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#3983fb] text-white p-3 rounded-lg font-bold hover:bg-[#0b101a] hover:text-[#3983fb] transition duration-300 ease-in-out"
                  >
                    Add Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
