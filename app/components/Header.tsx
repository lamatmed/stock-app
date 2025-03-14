"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/lok.jpg";
import { FaSignInAlt, FaSignOutAlt,  FaBars, FaTimes, FaProductHunt } from "react-icons/fa";

import { useUser, useClerk } from "@clerk/nextjs"; // ✅ Remplace useSignOut par useClerk
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAddBox, MdProductionQuantityLimits } from "react-icons/md";

const Header = () => {
  const { user } = useUser();
  const { signOut } = useClerk(); // ✅ Récupère signOut depuis useClerk
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image className="w-12 h-12" src={logo} alt="stok-app" priority={true} />
            </Link>
            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-4">
                <Link href="/stock" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                <MdProductionQuantityLimits />Stock
                </Link>
                {user && (
                  <>
                    <Link href="/products" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                    <FaProductHunt />Produits
                    </Link>
                    <Link href="/products/add" className="px-3 py-2 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white">
                    <MdAddBox />Ajouter produit
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu Droite */}
          <div className="flex items-center ml-auto">
            {!user && (
              <>
                <Link href="/sign-in" className="mr-3 text-gray-900 hover:text-gray-600">
                  <FaSignInAlt className="inline mr-1" /> Connexion
                </Link>
              
              </>
            )}

            {user && (
              <>
                <Link href="/dashboard" className="text-gray-900 hover:text-gray-600 ">
                  
                  <LuLayoutDashboard className="inline mr-1"  />Dashboard
                </Link>
                <button
                  onClick={() => signOut()} // ✅ Utilise signOut de useClerk
                  className="mx-3 text-gray-900 hover:text-gray-600"
                >
                  <FaSignOutAlt className="inline mr-1" /> Déconnexion
                </button>
              </>
            )}

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 md:hidden hover:text-gray-600"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>
       {/* Mobile Menu */}
       {isMenuOpen && (
        <div className='bg-gray-200 md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link href='/stock' className='block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white'>
            <MdProductionQuantityLimits  className="inline mr-1"  />Stock
            </Link>
            {user && (
              <>
                <Link href='/products' className='block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white'>
                <FaProductHunt className="inline mr-1"  />Produits
                </Link>
                <Link href='/products/add' className='block px-3 py-2 text-base font-medium text-gray-800 rounded-md hover:bg-gray-700 hover:text-white'>
                <MdAddBox className="inline mr-1" /> Ajouter produit
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
