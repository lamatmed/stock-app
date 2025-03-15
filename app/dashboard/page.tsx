"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaShoppingCart, FaDollarSign, FaPlus } from "react-icons/fa";
import Chart from "chart.js/auto";
import { getDashboardStats, getLatestProducts } from "../products/actions";
import Loader from "../components/Loader";

// Définition des types
interface Stats {
  totalProducts: number;
  totalSales: number;
  totalProfit: number;
  totalOrders: number;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price_v: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const chartRef = useRef<Chart | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchStats();
    fetchLatestProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  };

  const fetchLatestProducts = async () => {
    try {
      const data = await getLatestProducts();
      const formattedData = data.map((product) => ({
        ...product,
        id: Number(product.id),
      }));
      setLatestProducts(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stats && chartCanvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(chartCanvasRef.current, {
        type: "bar",
        data: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          datasets: [
            {
              label: "Ventes",
              data: [10, 20, 30, 40, 50, 60], // À remplacer par des données dynamiques
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        },
      });
    }
  }, [stats]);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Dashboard</h1>

      {/* Affichage du chargement */}
      {loading ? (
        <Loader/>
      ) : (
        <>
          {/* Cartes des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded flex items-center justify-between">
              <FaBox size={32} />
              <div>
                <h2 className="text-xl font-semibold">{stats?.totalProducts ?? 0}</h2>
                <p>Produits en stock</p>
              </div>
            </div>
            <div className="bg-green-500 text-white p-4 rounded flex items-center justify-between">
              <FaShoppingCart size={32} />
              <div>
                <h2 className="text-xl font-semibold">{stats?.totalSales ?? 0}</h2>
                <p>Ventes réalisées</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded flex items-center justify-between">
              <FaDollarSign size={32} />
              <div>
                <h2 className="text-xl font-semibold">{stats?.totalProfit ?? 0} UMR</h2>
                <p>Gains totaux</p>
              </div>
            </div>
          </div>

          {/* Graphique des ventes */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-black">Statistiques des ventes</h2>
            <canvas ref={chartCanvasRef}></canvas>
          </div>

          {/* Liste des derniers produits */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Derniers produits ajoutés</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sky-500">
                  <th className="p-2 border text-black">Nom</th>
                  <th className="p-2 border text-black">Quantité</th>
                  <th className="p-2 border text-black">Prix (UMR)</th>
                </tr>
              </thead>
              <tbody>
                {latestProducts.length > 0 ? (
                  latestProducts.map((product, index) => {
                    const productId =
                      product.id && !isNaN(Number(product.id)) ? product.id : `fallback-${index}`;
                    return (
                      <tr key={productId} className="border bg-white">
                        <td className="p-2 border text-black">{product.name}</td>
                        <td className="p-2 border text-center text-black">{product.quantity}</td>
                        <td className="p-2 border text-center text-black">{product.price_v}</td>
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
        </>
      )}
    </div>
  );
}
