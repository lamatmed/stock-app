"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "./components/Loader";

const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // Simule un chargement de 1.5s
  }, []);

  return (
    <section className="relative bg-green-100 py-20">
      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center justify-between">
        {loading ? (
          // Loader
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <Loader/>
          </div>
        ) : (
          <>
            {/* Texte */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Gérez votre <span className="text-green-600">Stock</span> <br /> en toute simplicité !
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Suivez vos produits, contrôlez vos ventes et optimisez votre stock avec notre solution moderne et intuitive.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start space-x-4">
                <Link
                  href="/sign-up"
                  className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  Démarrer maintenant
                </Link>
                <Link
                  href="/stock"
                  className="px-6 py-3 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  Voir les produits
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="lg:w-1/2 flex justify-center">
              <Image
                src="/logo.svg" // Remplace avec une vraie image
                alt="Gestion de stock"
                width={500}
                height={500}
                className="drop-shadow-lg"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
