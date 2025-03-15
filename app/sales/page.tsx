'use client'
import { useState, useEffect } from "react";
import { addSale, getAllProducts, getSalesHistory } from "../products/actions";

interface Product {
  id: string;
  code: string;
  name: string;
  quantity: number;
  price_v: number;
}

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const productList = await getAllProducts();
      setProducts(productList);
      const sales = await getSalesHistory();
      setSalesHistory(sales);
    }
    fetchData();
  }, []);

  const handleSale = async () => {
    if (!selectedProduct || quantity <= 0) {
      setError("Sélectionnez un produit et entrez une quantité valide.");
      return;
    }

    const result = await addSale(selectedProduct, quantity);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Vente enregistrée avec succès !");
      setError("");
      setQuantity(1);
      const productList = await getAllProducts();
      setProducts(productList);
      const sales = await getSalesHistory();
      setSalesHistory(sales);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md md:max-w-lg">
      <h1 className="text-xl font-bold text-center mb-4">Vente de Produits</h1>
      
      {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center bg-green-100 p-2 rounded">{success}</p>}

      <div className="mt-4">
        <label className="block text-sm font-semibold">Produit :</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border p-2 w-full rounded-md"
        >
          <option value="">Sélectionner un produit</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (Stock: {product.quantity})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold">Quantité :</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 w-full rounded-md"
          min="1"
        />
      </div>

      <button 
        onClick={handleSale} 
        className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition"
      >
        Vendre
      </button>

      <h2 className="mt-8 text-lg font-bold text-center">Historique des Ventes</h2>
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Produit</th>
              <th className="border p-2">Quantité</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.map((sale) => (
              <tr key={sale.id} className="text-center">
                <td className="border p-2">{sale.productName}</td>
                <td className="border p-2">{sale.quantity}</td>
                <td className="border p-2">{sale.totalPrice} MRU</td>
                <td className="border p-2">{new Date(sale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
