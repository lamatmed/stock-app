"use client";

import { useState, useEffect } from "react";
import { getAllProducts, deleteProduct } from "./actions";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { MdOutlineDelete } from "react-icons/md";
import Swal from "sweetalert2"
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
type Product = {
  id: string;
  code: string;
  name: string;
  quantity: number;
  price_v: number;
  price_a: number;
  expirationDate: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    const formattedData = data.map((product) => ({
      ...product,
      expirationDate: new Date(product.expirationDate).toISOString().split("T")[0],
    }));
    setProducts(formattedData);
    setFilteredProducts(formattedData);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await Swal.fire({
      title: "Supprimer le produit ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
  
    if (result.isConfirmed) {
      await deleteProduct(id);
      fetchProducts();
      toast.success("Produit supprimé avec succès !");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filtered = products.filter((p) =>
      p.code.toLowerCase().includes(e.target.value.toLowerCase()) ||
      p.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des Produits</h1>

      <button 
        className="bg-blue-800 text-white p-2 rounded w-full mb-4 hover:bg-blue-600"
        onClick={() => router.push("/products/add")}
      >
        Ajouter un produit
      </button>

      <input
        className="border p-2 w-full mb-4 rounded"
        type="text"
        placeholder="Rechercher par code ou nom..."
        value={search}
        onChange={handleSearch}
      />

      {loading ? (
       <Loader/>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-white text-left text-sm">
                <th className="p-2 text-black">Code</th>
                <th className="p-2 text-black">Nom</th>
                <th className="p-2 text-black">Qté</th>
                <th className="p-2 text-black">Vente (UMR)</th>
                <th className="p-2 text-black">Achat (UMR)</th>
                <th className="p-2 text-black">Exp</th>
                <th className="p-2 text-center text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p) => (
                <tr key={p.id} className="border-t text-sm bg-white">
                  <td className="p-2 text-black">{p.code}</td>
                  <td className="p-2 text-black">{p.name}</td>
                  <td className="p-2 text-black">{p.quantity}</td>
                  <td className="p-2 text-black">{p.price_v}</td>
                  <td className="p-2 text-black">{p.price_a}</td>
                  <td className="p-2 text-black">{p.expirationDate}</td>
                  <td className="p-2 flex justify-center space-x-2">
                    <button
                      className="bg-yellow-700 text-white px-3 py-1 rounded hover:bg-yellow-400"
                      onClick={() => router.push(`/products/${p.id}`)}
                    >
                     <FaEdit className="text-xl"  />
                    </button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-400"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      <MdOutlineDelete className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
