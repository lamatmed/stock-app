import Head from "next/head";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaMoneyCheckAlt, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function About() {
  return (
    <>
      <Head>
        <title>À Propos | Stock-App</title>
        <meta name="description" content="Découvrez notre entreprise et notre mission." />
      </Head>

      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        {/* En-tête */}
        <h1 className="text-2xl font-extrabold text-center text-blue-600 mb-6">À Propos de Nous</h1>
        <p className="text-lg text-center mb-6">
          Bienvenue sur <strong>Mon E-commerce</strong>, votre boutique en ligne de confiance.  
          Nous proposons une large gamme de produits de qualité à des prix compétitifs.
        </p>

        {/* Section Mission */}
        <h2 className="text-2xl font-semibold text-blue-500 mt-8 flex items-center">
          <FaShieldAlt className="mr-2 text-blue-600" /> Notre Mission
        </h2>
        <p className="text-lg mt-2">
          Nous nous engageons à offrir une expérience d&apos;achat rapide, sécurisée et agréable, 
          avec un excellent service client et des produits soigneusement sélectionnés.
        </p>

        {/* Pourquoi Nous Choisir */}
        <h2 className="text-2xl font-semibold text-blue-500 mt-8 flex items-center">
          <FaShippingFast className="mr-2 text-blue-600" /> Pourquoi Nous Choisir ?
        </h2>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center">
            <FaShieldAlt className="text-green-500 mr-2" /> Produits de haute qualité
          </li>
          <li className="flex items-center">
            <FaShippingFast className="text-orange-500 mr-2" /> Livraison rapide et fiable
          </li>
          <li className="flex items-center">
            <FaHeadset className="text-blue-500 mr-2" /> Service client réactif
          </li>
          <li className="flex items-center">
            <FaMoneyCheckAlt className="text-purple-500 mr-2" /> Paiements sécurisés
          </li>
        </ul>

        {/* Nos Contacts */}
        <h2 className="text-2xl font-semibold text-blue-500 mt-8 flex items-center">
          <FaPhone className="mr-2 text-blue-600" /> Nos Contacts
        </h2>
        <div className="mt-4 space-y-3">
          <p className="flex items-center">
            <FaPhone className="text-green-500 mr-2" /> +244 939 465 408
          </p>
          <p className="flex items-center">
            <FaEnvelope className="text-red-500 mr-2" /> lamat032025@gmail.com
          </p>
          <p className="flex items-center">
            <FaMapMarkerAlt className="text-orange-500 mr-2" /> 123 Rue de l&apos;espoir, Nouakchott, Mauritanie
          </p>
        </div>
      </div>
    </>
  );
}
