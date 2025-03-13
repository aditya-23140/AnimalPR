// "use client";
// import React, { useState, useEffect } from "react";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import { motion } from "framer-motion";
// import CirclesBackground from "@/components/background";
// import Image from "next/image";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_PORT;

// const Dashboard = () => {
//   const [pets, setPets] = useState([]);

// useEffect(() => {
//   const fetchPets = async () => {
//     const response = await fetch(`${BACKEND_URL}/api/auth/dashboard/pets/`);
//     if (response.ok) {
//       const data = await response.json();
//       setPets(data);
//     } else {
//       console.error("Failed to fetch public pets");
//     }
//   };

//   fetchPets();
// }, []);

//   return (
//     <div>
//       {/* <CirclesBackground height={window.innerHeight} /> */}
//       <Navbar />
// {pets.length > 0 ? (
//   pets.map((pet, index) => (
//     <div className="row mt-8" key={index}>
//       <div className="service">
//         <div className="illus">
//           <div className="services_content">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//               className="relative h-full overflow-hidden"
//             >
//               <Image
//                 className="rounded-lg"
//                 src={`${BACKEND_URL}/media/${pet.images[0]}`}
//                 alt={pet.name}
//                 responsive="true"
//                 width={400}
//                 height={200}
//               />
//               <div className="mt-4 text-center">
//                 <h2 className="font-bold text-lg text-white"></h2>
//                 <p className="text-sm text-gray-300"></p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//         <div className="services_content">
//           <h2 className="mb-2 lg:text-4xl text-3xl font-semibold">
//             {pet.name}
//           </h2>
//           <p className="leading-normal lg:text-xl text-l font-light mb-4 text-gray-400">
//             {pet.type} - {pet.breed}
//           </p>
//         </div>
//       </div>
//     </div>
//   ))
// ) : (
//   <p className="text-center text-white">No public pets available.</p>
// )}
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;

"use client";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/navbar";
import CirclesBackground from "@/components/background";
import Footer from "@/components/footer";

export default function dashboard() {
  return (
    <>
      {/* <CirclesBackground height={window.innerHeight} /> */}
      <Dashboard />
      <Footer />
    </>
  );
}
