import React, { useState, useEffect } from "react";

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
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Historique des ventes</h2>

      {loading ? (
        <p className="text-center text-blue-500">Chargement des ventes...</p>
      ) : (
        <>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Produit</th>
                <th className="border p-2">Quantité</th>
                <th className="border p-2">Prix total</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length > 0 ? (
                currentSales.map((sale) => (
                  <tr key={sale.id} className="border">
                    <td className="border p-2">{sale.productName}</td>
                    <td className="border p-2">{sale.quantity}</td>
                    <td className="border p-2">{sale.totalPrice} MRU</td>
                    <td className="border p-2">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-2 text-center">
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
              className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
            >
              Précédent
            </button>
            <span className="text-lg font-bold">
              Page {currentPage} / {Math.ceil(sales.length / itemsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(sales.length / itemsPerPage)}
              className={`px-4 py-2 bg-gray-300 rounded ${currentPage === Math.ceil(sales.length / itemsPerPage) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
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
