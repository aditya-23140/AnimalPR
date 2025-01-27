"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function SearchAnimal() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    getCamera();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImages([imageData]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([reader.result]);
      };
      reader.readAsDataURL(file);
      setIsFileSelected(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResults([]);

    const formData = new FormData();
    images.forEach((image) => {
      const byteString = atob(image.split(",")[1]);
      const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append("images", blob, "captured_image.png");
    });

    try {
      const response = await fetch("http://localhost:8000/api/search_animal/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResults(data.matches);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Search Animal</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Capture or Upload Image
          </label>
          {!isFileSelected && (
            <>
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-auto border border-gray-300 rounded mb-2"
              />
              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                width={640}
                height={480}
              />
              <button
                type="button"
                onClick={captureImage}
                className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
              >
                Capture Image
              </button>
            </>
          )}
          {isFileSelected ? (
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-gray-700">Selected File</h3>
              <p>{images[0]}</p>
            </div>
          ) : (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full py-2 px-4 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-red-500 font-semibold text-center">
          {message}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Image Preview</h2>
          <Image
            src={images[0]}
            alt="Captured Image"
            className="w-16 h-16 object-cover border border-gray-300 rounded"
            width={64}
            height={64}
            onError={(e) => {
              e.target.src = "/fallback-image.jpg";
            }}
          />
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 w-full max-w-lg" style={{ color: "black" }}>
          <h2 className="text-lg font-bold mb-2">Search Results</h2>
          <ul className="space-y-4">
            {results.map((result, index) => (
              <li
                key={index}
                className="p-4 border border-gray-300 rounded shadow-sm"
              >
                <p>
                  <strong>Animal ID:</strong> {result.animal_id}
                </p>
                <p>
                  <strong>Similarity:</strong>{" "}
                  {(result.similarity * 100).toFixed(2)}%
                </p>
                <div className="flex space-x-2 mt-2">
                  {result.images.map((img, i) => (
                    <Image
                      key={i}
                      src={`http://localhost:8000/media/${img}`}
                      alt="Animal"
                      className="w-16 h-16 object-cover border border-gray-300 rounded"
                      width={64}
                      height={64}
                      onError={(e) => {
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
