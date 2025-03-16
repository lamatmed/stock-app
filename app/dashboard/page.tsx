"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { getDashboardStats, getSalesHistory, getMonthlySales } from "../utils/actions";
import Chart from "chart.js/auto";
import Loader from "../components/Loader";
import SalesHistoryDay from "../components/SalesHistoryDay";

// Définition des types
interface Stats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
}

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface MonthlySales {
  month: string;
  totalSales: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);

  useEffect(() => {
    async function fetchData() {
      const sales = await getSalesHistory();
      setSalesHistory(sales);
    }
    fetchData();
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMonthlySales();
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

  const fetchMonthlySales = async () => {
    try {
      const data = await getMonthlySales();
  
      // Agréger les ventes par mois
      const salesByMonth: { [key: string]: number } = {};
      data.forEach(({ month, totalSales }) => {
        if (!salesByMonth[month]) {
          salesByMonth[month] = 0;
        }
        salesByMonth[month] += totalSales;
      });
  
      // Transformer l'objet en tableau
      const aggregatedSales = Object.entries(salesByMonth).map(([month, totalSales]) => ({
        month,
        totalSales,
      }));
  
      console.log("Ventes mensuelles agrégées :", aggregatedSales);
      setMonthlySales(aggregatedSales);
    } catch (error) {
      console.error("Erreur lors du chargement des ventes mensuelles :", error);
    }
  };
  

  useEffect(() => {
    if (stats && chartCanvasRef.current) {
      const ctx = chartCanvasRef.current.getContext("2d");
      if (!ctx) return;

      Chart.getChart(chartCanvasRef.current)?.destroy();

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Produits", "Ventes", "Gains (MRU)", "Commandes"],
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

  useEffect(() => {
    console.log("Mise à jour du graphique mensuel avec :", monthlySales);
    if (monthlySales.length > 0 && monthlyChartRef.current) {
      const ctx = monthlyChartRef.current.getContext("2d");
      if (!ctx) return;
  
      Chart.getChart(monthlyChartRef.current)?.destroy();
  
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: monthlySales.map((sale) => sale.month),
          datasets: [
            {
              label: "Ventes mensuelles (MRU)",
              data: monthlySales.map((sale) => sale.totalSales),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [monthlySales]);
  

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
                <h2 className="text-2xl font-semibold">{stats?.totalSales ?? 0} MRU</h2>
                <p>Ventes réalisées</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded flex items-center justify-between">
              <FaDollarSign size={32} />
              <div>
                <h2 className="text-2xl font-semibold">{stats?.totalProfit ?? 0} MRU</h2>
                <p>Gains totaux</p>
              </div>
            </div>
          </div>

          {/* Graphique avec Chart.js */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-black">Statistiques Graphiques</h2>
            <canvas ref={chartCanvasRef} className="w-full h-80"></canvas>
          </div>

          {/* Graphique des ventes mensuelles */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-black">Ventes Mensuelles</h2>
            <canvas ref={monthlyChartRef} className="w-full h-80"></canvas>
          </div>

          <div className="py-4">
            <button
              className="bg-gray-800 text-white p-2 rounded w-full mb-4 hover:bg-gray-600"
              onClick={() => setShowSalesHistory(!showSalesHistory)}
            >
              {showSalesHistory ? "Masquer l'historique" : "Afficher l'historique par jour"}
            </button>

            {showSalesHistory && (
              <>
                <h2 className="mt-8 text-lg font-bold text-center text-black">Historique des Ventes </h2>
                <SalesHistoryDay sales={salesHistory} />
              </>
            )}
          </div>

          {/* Boutons rapides */}
          <div className="flex justify-center mt-6 gap-4">
            <button
              className="bg-blue-800 text-white p-3 rounded flex items-center gap-2 hover:bg-blue-600 "
              onClick={() => router.push("/products/add")}
            >
              Ajouter un produit
            </button>
            <button
              className="bg-green-800 text-white p-3 rounded flex items-center gap-2 hover:bg-green-600"
              onClick={() => router.push("/commandes")}
            >
              Voir les ventes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
