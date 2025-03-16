'use client'
import { useEffect, useState } from "react";
import { FaFileInvoice, FaBox, FaCalendarAlt, FaDollarSign, FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { getInvoiceHistory } from "../utils/actions";
import Loader from "../components/Loader";

type Sale = {
  productName: string;
  quantity: number;
  totalPrice: number;
};

type Invoice = {
  id: string;
  totalAmount: number;
  purchaseTotal: number;
  createdAt: string;
  sales: Sale[];
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchDate, setSearchDate] = useState(""); // État pour la recherche par date
  const invoicesPerPage = 5; 

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true);
      const data = await getInvoiceHistory();
      setInvoices(data);
      setIsLoading(false);
    }
    fetchInvoices();
  }, []);

  // Filtrage des factures par date si une date est entrée
  const filteredInvoices = searchDate
    ? invoices.filter(invoice =>
        new Date(invoice.createdAt).toISOString().split('T')[0] === searchDate
      )
    : invoices;

  // Pagination
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-blue-600 flex items-center">
        <FaFileInvoice className="mr-2" /> Historique des Factures
      </h1>

      {/* Champ de recherche par date */}
      <div className="mt-4 flex items-center ">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded-lg text-black w-100 "
        />
        <FaSearch className="ml-2 text-blue-500" />
      </div>

      {isLoading ? (
        <Loader />
      ) : filteredInvoices.length === 0 ? (
        <p className="text-black mt-4">Aucune facture trouvée.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {currentInvoices.map((invoice) => (
            <div key={invoice.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                {new Date(invoice.createdAt).toLocaleDateString()}
              </h2>
              <p className="text-gray-700 flex items-center">
                <FaDollarSign className="mr-2 text-green-500" />
                Montant Total: <strong className="ml-1">{invoice.totalAmount.toFixed(2)} MRU</strong>
              </p>
              <h3 className="text-lg font-semibold mt-2 text-black">Produits:</h3>
              <ul className="ml-4 list-disc">
                {invoice.sales.map((sale, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <FaBox className="mr-2 text-gray-500" />
                    {sale.productName} (x{sale.quantity}) - {sale.totalPrice.toFixed(2)} MRU
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Boutons de pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white rounded-lg ${
                currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } flex items-center`}
            >
              <FaArrowLeft className="mr-2" /> Précédent
            </button>

            <span className="text-lg font-semibold text-black">{currentPage}</span>

            <button
              onClick={() => setCurrentPage((prev) => (indexOfLastInvoice < filteredInvoices.length ? prev + 1 : prev))}
              disabled={indexOfLastInvoice >= filteredInvoices.length}
              className={`px-4 py-2 text-white rounded-lg ${
                indexOfLastInvoice >= filteredInvoices.length ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } flex items-center`}
            >
              Suivant <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
