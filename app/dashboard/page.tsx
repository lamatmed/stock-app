"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { getDashboardStats } from "../products/actions";
import Chart from "chart.js/auto";
import Loader from "../components/Loader";

// Définition des types
interface Stats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      console.log("Statistiques récupérées :", data);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stats && chartCanvasRef.current) {
      const ctx = chartCanvasRef.current.getContext("2d");
      if (!ctx) return;

      // Vérifier s'il y a déjà un graphique sur le canvas et le détruire
      Chart.getChart(chartCanvasRef.current)?.destroy();

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Produits", "Ventes", "Gains (UMR)", "Commandes"],
          datasets: [
            {
              label: "Statistiques",
              data: [
                stats.totalProducts,
                stats.totalSales,
                stats.totalProfit,
                stats.totalOrders,
              ],
              backgroundColor: ["blue", "green", "yellow", "red"],
            },
          ],
        },
      });
    }
  }, [stats]);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Dashboard</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Statistiques numériques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded flex items-center justify-between">
              <FaBox size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalProducts ?? 0}</h2>
                <p>Produits en stock</p>
              </div>
            </div>
            <div className="bg-green-500 text-white p-4 rounded flex items-center justify-between">
              <FaShoppingCart size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalSales ?? 0}</h2>
                <p>Ventes réalisées</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded flex items-center justify-between">
              <FaDollarSign size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalProfit ?? 0} UMR</h2>
                <p>Gains totaux</p>
              </div>
            </div>
          </div>

          {/* Graphique avec Chart.js */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-black">Statistiques Graphiques</h2>
            <canvas ref={chartCanvasRef} className="w-full h-80"></canvas>
          </div>

          {/* Boutons rapides */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              className="bg-blue-600 text-white p-3 rounded flex items-center gap-2"
              onClick={() => router.push("/products/add")}
            >
              Ajouter un produit
            </button>
            <button
              className="bg-green-600 text-white p-3 rounded flex items-center gap-2"
              onClick={() => router.push("/sales")}
            >
              Voir les ventes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
