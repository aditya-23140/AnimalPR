"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pets, setPets] = useState([]);
  const slides = [
    { src: "/ichigo.jpg", alt: "Slide 1" },
    { src: "/bg.avif", alt: "Slide 2" },
    { src: "/ichigo.jpg", alt: "Slide 3" },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    clearInterval();
  };

  useEffect(() => {
    const fetchPets = async () => {
      const response = await fetch('http://localhost:8000/api/auth/dashboard/pets/');
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        console.error("Failed to fetch public pets");
      }
    };

    fetchPets();
  }, []);

  return (
    <div>
      <Navbar />
      <main className="min-h-[79vh] relative">
        <div id="carousel" className="relative w-full">
          <div className="relative h-56 overflow-hidden md:h-96">
            <AnimatePresence>
              {slides.map((slide, index) => (
                index === currentSlide && (
                  <motion.div
                    key={index}
                    className="absolute w-full h-full"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <Image
                      src={slide.src}
                      className="block w-full h-full object-cover"
                      alt={slide.alt}
                      width={500}
                      height={300}
                    />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-blue-600" : "bg-white"}`}
                  onClick={() => handleSlideChange(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-center bg-no-repeat bg-gray-700 relative py-10 lg:py-20 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-50"></div>
          <div className="relative z-10 px-4 mx-auto max-w-screen-xl text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Welcome to PetGle
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
              At PetGle, we make pet identification easy and efficient, ensuring your furry friends are always recognized!
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {pets.length > 0 ? (
            pets.map((pet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-full overflow-hidden"
              >
                <img
                  className="h-40 w-full object-cover rounded-lg"
                  src={`http://localhost:8000${pet.photos}`}
                  alt={pet.name}
                  width={400}
                  height={200}
                />
                <div className="mt-4 text-center">
                  <h2 className="font-bold text-lg text-white">{pet.name}</h2>
                  <p className="text-sm text-gray-300">{pet.type} - {pet.breed}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-white">No public pets available.</p>
          )}
        </div>

        <button
          type="button"
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group opacity-0 pointer-events-auto"
          onClick={handlePrev}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group opacity-0 pointer-events-auto"
          onClick={handleNext}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
