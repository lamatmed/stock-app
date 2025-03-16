import React, { useState, useEffect } from "react";
import Loader from "./Loader";

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistoryDay: React.FC<SalesHistoryProps> = ({ sales }) => {
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simule un chargement des données (500ms)
  }, [sales]);

  // Fonction pour regrouper les ventes par jour
  const groupSalesByDay = () => {
    const grouped: Record<string, { sales: Sale[]; total: number }> = {};
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { sales: [], total: 0 };
      }
      grouped[date].sales.push(sale);
      grouped[date].total += sale.totalPrice;
    });
    return grouped;
  };

  // Fonction pour calculer le total des ventes du mois
  const getTotalSalesByMonth = () => {
    return sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
  };

  const groupedSales = groupSalesByDay();
  const totalSalesByMonth = getTotalSalesByMonth();

  
  const getCurrentMonthYear = () => {
    const now = new Date();
    return now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };
 
  return (
    <div className="mt-6 bg-white">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Résumé des ventes par jour */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-black mb-2">Total des ventes par jour :</h2>
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-white">
                  <th className="border p-2 text-black">Date</th>
                  <th className="border p-2 text-black">Total des ventes (MRU)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedSales).map((date) => (
                  <tr key={date} className="border">
                    <td className="border p-2 text-black">{date}</td>
                    <td className="border p-2 text-black">{groupedSales[date].total} MRU</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total des ventes du mois */}
          <div className="mt-6 text-lg font-bold text-black">
             <p>Total des ventes du {getCurrentMonthYear()} : {totalSalesByMonth} MRU</p>
         </div>
        </>
      )}
    </div>
  );
};

export default SalesHistoryDay;
