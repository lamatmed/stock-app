/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { addMultipleSales, getAllProducts, getSalesHistory } from "../products/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import SalesHistory from "../components/SelesHostory";

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

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const productList = await getAllProducts();
      setProducts(productList);
      const sales = await getSalesHistory();
      setSalesHistory(sales);
    }
    fetchData();
  }, []);

  const addToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error("Sélectionnez un produit et entrez une quantité valide.");
      return;
    }
  
    const product = products.find((p) => p.id === selectedProduct);
    if (!product || product.quantity < quantity) {
      toast.error("Quantité insuffisante en stock.");
      return;
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === selectedProduct);
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
            : item
        );
      }
  
      return [...prevCart, { productId: product.id, productName: product.name, quantity, unitPrice: product.price_v, totalPrice: product.price_v * quantity }];
    });
  
    setSelectedProduct("");
    setQuantity(1);
    toast.success("Produit ajouté au panier !");
  };
  
  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    toast.info("Produit retiré du panier.");
  };


  const handleSale = async () => {
    if (cart.length === 0) {
        toast.error("Ajoutez au moins un produit au panier.");
        return;
    }

    const confirm = await Swal.fire({
        title: "Confirmer la vente ?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, valider",
        cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
        setLoading(true); // 🔹 Activer le chargement

        try {
            const result = await addMultipleSales(cart);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Vente enregistrée avec succès !");
                setCart([]);
                const productList = await getAllProducts();
                setProducts(productList);
                const sales = await getSalesHistory();
                setSalesHistory(sales);
            }
        } catch (error) {
            toast.error("Une erreur s'est produite.");
            console.error("Erreur lors de la vente :", error);
        } finally {
            setLoading(false); // 🔹 Désactiver le chargement
        }
    }
};


  const generateInvoice = () => {
    if (cart.length === 0) {
      toast.error("Aucun produit dans le panier pour générer la facture.");
      return;
    }
  
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const invoiceId = `INV-${today.getTime()}`;
  
    // Centrer le titre
    const title = "Stock-App v1.0.0";
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: "center" });
  
    doc.setFontSize(12);
    doc.text(`Date: ${dateStr}`, 14, 25);
    doc.text(`Facture N°: ${invoiceId}`, 14, 35);
  
    // Générer la table
    autoTable(doc, {
      head: [["Produit", "Quantité", "Prix Unitaire", "Total"]],
      body: cart.map((item) => [item.productName, item.quantity, item.unitPrice.toFixed(2), item.totalPrice.toFixed(2)]),
      startY: 45,
    });
  
    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(12);
    doc.text(`Total: ${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} MRU`, 14, finalY + 10);
  
    doc.save(`facture_${invoiceId}.pdf`);
    toast.success("Facture téléchargée avec succès !");
  };
  
  return (
    <div className="container mx-auto p-4 max-w-md md:max-w-lg">
      <h1 className="text-xl font-bold text-center mb-4">Acheter de Produits</h1>

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
        onClick={addToCart} 
        className="mt-4 bg-gray-500 text-white p-2 rounded-md w-full hover:bg-gray-600 transition"
      >
        Ajouter au panier
      </button>

      <h2 className="mt-8 text-lg font-bold text-center">Panier</h2>
      {cart.length > 0 && (
        <div className="border p-4 rounded-md bg-gray-50">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-sm">{item.productName} - {item.quantity} x {item.unitPrice} MRU = {item.totalPrice} MRU</p>
              <button onClick={() => removeFromCart(index)} className="bg-red-500 text-white px-2 py-1 rounded">X</button>
            </div>
          ))}
          <p className="font-bold mt-2">Total: {cart.reduce((sum, item) => sum + item.totalPrice, 0)} MRU</p>
        </div>
      )}

      <button 
        onClick={handleSale} 
        className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition"
        disabled={loading}
      >
         {loading ? "Vente en cours..." : "Acheter"}
      </button>

      <button 
        onClick={generateInvoice} 
        className="mt-4 bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition"
      >
        Télécharger la facture PDF
      </button>

      <h2 className="mt-8 text-lg font-bold text-center">Historique des Ventes</h2>
      <SalesHistory sales={salesHistory} />
    </div>
  );
}
