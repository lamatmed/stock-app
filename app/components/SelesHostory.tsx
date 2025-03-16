import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { FaSearch } from "react-icons/fa";

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
  const [itemsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [sales]);

  // Filtrer les ventes par date sélectionnée
  const filteredSales = searchDate
    ? sales.filter((sale) => sale.createdAt.startsWith(searchDate))
    : sales;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  // Calcul des totaux des ventes par mois et par année
  const totalByMonth: Record<string, number> = {};
  const totalByYear: Record<string, number> = {};

  sales.forEach((sale) => {
    const date = new Date(sale.createdAt);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    const year = `${date.getFullYear()}`;

    if (!totalByMonth[month]) totalByMonth[month] = 0;
    totalByMonth[month] += sale.totalPrice;

    if (!totalByYear[year]) totalByYear[year] = 0;
    totalByYear[year] += sale.totalPrice;
  });

  // Changer de page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSales.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      {/* Champ de recherche par date */}
      <div className="mb-4 flex items-center">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded-lg text-black w-64"
        />
        <FaSearch className="ml-2 text-blue-500" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Tableau des ventes */}
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
                    Aucune vente enregistrée pour cette date.
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
              className={`px-4 py-2 bg-blue-900 text-white rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              Précédent
            </button>
            <span className="text-lg font-bold text-black">
              Page {currentPage} / {Math.ceil(filteredSales.length / itemsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(filteredSales.length / itemsPerPage)}
              className={`px-4 py-2 bg-blue-900 text-white rounded ${
                currentPage === Math.ceil(filteredSales.length / itemsPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              Suivant
            </button>
          </div>

          {/* Totaux des ventes par mois et par année */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-blue-600">Totaux des ventes</h2>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-black">Par Mois :</h3>
              <ul className="list-disc ml-4 text-black">
                {Object.entries(totalByMonth).map(([month, total]) => (
                  <li key={month}>
                    <strong>{month}</strong> : {total.toFixed(2)} MRU
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-black">Par Année :</h3>
              <ul className="list-disc ml-4 text-black">
                {Object.entries(totalByYear).map(([year, total]) => (
                  <li key={year}>
                    <strong>{year}</strong> : {total.toFixed(2)} MRU
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesHistory;
