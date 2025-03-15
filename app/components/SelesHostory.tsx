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

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Nombre de ventes par page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500); // Simule un chargement des données (500ms)
  }, [sales]);

  // Pagination : calculer les ventes affichées
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const nextPage = () => {
    if (currentPage < Math.ceil(sales.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-6 bg-white">
      <h2 className="text-lg font-bold mb-2 text-black">Historique des ventes</h2>

      {loading ? (
       
          <Loader/>
     
      ) : (
        <>
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-white">
                <th className="border p-2 text-black">Produit</th>
                <th className="border p-2 text-black">Quantité</th>
                <th className="border p-2 text-black">Prix total</th>
                <th className="border p-2 text-black">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length > 0 ? (
                currentSales.map((sale) => (
                  <tr key={sale.id} className="border">
                    <td className="border p-2 text-black">{sale.productName}</td>
                    <td className="border p-2 text-black">{sale.quantity}</td>
                    <td className="border p-2 text-black">{sale.totalPrice} MRU</td>
                    <td className="border p-2 text-black">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-2 text-center text-black">
                    Aucune vente enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-blue-900 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            >
              Précédent
            </button>
            <span className="text-lg font-bold text-black">
              Page {currentPage} / {Math.ceil(sales.length / itemsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(sales.length / itemsPerPage)}
              className={`px-4 py-2 bg-blue-900 text-white rounded ${currentPage === Math.ceil(sales.length / itemsPerPage) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesHistory;
