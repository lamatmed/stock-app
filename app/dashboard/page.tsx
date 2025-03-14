"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaShoppingCart, FaDollarSign, FaPlus } from "react-icons/fa";
import Chart from "chart.js/auto";
import { getDashboardStats, getLatestProducts } from "../products/actions";

// Définition des types pour éviter les erreurs TypeScript
interface Stats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number; // Remplacement de `totalRevenue` par `totalProfit`
  totalOrders: number;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price_v: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalSales: 0,
    totalProfit: 0, // Changement ici
    totalOrders: 0,
  });

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const router = useRouter();
  const chartRef = useRef<Chart | null>(null); // Référence pour le graphique

  useEffect(() => {
    fetchStats();
    fetchLatestProducts();
  }, []);

  const fetchStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  const fetchLatestProducts = async () => {
    const data = await getLatestProducts();
    const formattedData = data.map((product) => ({
      ...product,
      id: Number(product.id), // Convertir `id` en nombre
    }));
    setLatestProducts(formattedData);
  };
  
  useEffect(() => {
    const canvas = document.getElementById("salesChart") as HTMLCanvasElement;
    if (canvas) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Détruit le graphique précédent pour éviter les doublons
      }

      chartRef.current = new Chart(canvas, {
        type: "bar",
        data: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [
            {
              label: "Ventes",
              data: [10, 20, 30, 40, 50, 60], // Remplace par des données réelles
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
      });
    }
  }, [stats]); // Met à jour le graphique lorsque les stats changent

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Cartes des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded flex items-center justify-between">
          <FaBox size={32} />
          <div>
            <h2 className="text-xl font-semibold">{stats.totalProducts}</h2>
            <p>Produits en stock</p>
          </div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded flex items-center justify-between">
          <FaShoppingCart size={32} />
          <div>
            <h2 className="text-xl font-semibold">{stats.totalSales}</h2>
            <p>Ventes réalisées</p>
          </div>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded flex items-center justify-between">
          <FaDollarSign size={32} />
          <div>
            <h2 className="text-xl font-semibold">{stats.totalProfit} UMR</h2>
            <p>Gains totaux</p>
          </div>
        </div>
      </div>

      {/* Graphique des ventes */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Statistiques des ventes</h2>
        <canvas id="salesChart"></canvas>
      </div>

      {/* Liste des derniers produits */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Derniers produits ajoutés</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Quantité</th>
              <th className="p-2 border">Prix (UMR)</th>
            </tr>
          </thead>
          <tbody>
          {latestProducts.length > 0 ? (
  latestProducts.map((product, index) => {
    // Vérifier et corriger l'ID
    const productId = product.id && !isNaN(Number(product.id)) ? product.id : `fallback-${index}`;
    return (
      <tr key={productId} className="border">
        <td className="p-2 border">{product.name}</td>
        <td className="p-2 border text-center">{product.quantity}</td>
        <td className="p-2 border text-center">{product.price_v}</td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan={3} className="p-2 text-center">
      Aucun produit récent
    </td>
  </tr>
)}


          </tbody>
        </table>
      </div>

      {/* Boutons rapides */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          className="bg-blue-600 text-white p-3 rounded flex items-center gap-2"
          onClick={() => router.push("/products/add")}
        >
          <FaPlus /> Ajouter un produit
        </button>
        <button
          className="bg-green-600 text-white p-3 rounded flex items-center gap-2"
          onClick={() => router.push("/sales")}
        >
          Voir les ventes
        </button>
      </div>
    </div>
  );
}
